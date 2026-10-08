import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { describe, it } from "node:test";
import { ASSESSMENT_SERVICE, assessmentCheckoutAllowed, assessmentPrice } from "./assessment";
import { startAssessmentCheckout, type AssessmentCheckoutDeps } from "./assessment-checkout";
import { applyAssessmentEvent } from "./assessment-events";
import { buildAssessmentCheckoutRequest, createAssessmentCheckout } from "./dodo";
import { createJsonRepository } from "./repo/json";
import { createD1Repository, type D1Like } from "./repo/d1";
import { toAccountView } from "./account-view";
import { exchangeGoogleCode } from "./google";

type Sqlite = {
  exec(sql: string): void;
  prepare(sql: string): {
    get(...values: unknown[]): Record<string, unknown> | undefined;
    all(...values: unknown[]): Record<string, unknown>[];
    run(...values: unknown[]): unknown;
  };
};
const { DatabaseSync } = createRequire(import.meta.url)("node:sqlite") as { DatabaseSync: new (name: string) => Sqlite };

function fixture(kind: "json" | "d1", includeAssessmentMigration = true) {
  if (kind === "json") {
    const file = path.join(mkdtempSync(path.join(tmpdir(), "dcredit-phase1-")), "store.json");
    return { repo: createJsonRepository(file), reload: () => createJsonRepository(file), sqlite: null };
  }
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys=ON");
  for (const name of ["0001_init.sql", "0002_payment_provider.sql", "0003_appointment_meeting.sql", ...(includeAssessmentMigration ? ["0004_initial_assessment.sql", "0005_cashfree_assessment.sql"] : [])]) {
    sqlite.exec(readFileSync(path.join(process.cwd(), "migrations", name), "utf8"));
  }
  const db: D1Like = {
    prepare(sql) {
      let values: unknown[] = [];
      const stmt = {
        bind(...args: unknown[]) { values = args; return stmt; },
        async first<T = Record<string, unknown>>() { return (sqlite.prepare(sql).get(...values) || null) as T | null; },
        async all<T = Record<string, unknown>>() { return { results: sqlite.prepare(sql).all(...values) as T[] }; },
        async run() { return sqlite.prepare(sql).run(...values); },
      };
      return stmt;
    },
  };
  return { repo: createD1Repository(db), reload: () => createD1Repository(db), sqlite };
}
const fields = {
  service: ASSESSMENT_SERVICE, acknowledgeService: "yes", acknowledgePrivacy: "yes", acknowledgePendingPolicy: "yes",
};
function dependencies(): AssessmentCheckoutDeps & { calls: string[] } {
  const calls: string[] = [];
  return {
    environment: "development", providerEnvironment: "test_mode", configured: () => true, calls,
    checkout: async (input) => {
      calls.push(input.orderId);
      return { id: `cks_${input.orderId}`, url: `https://checkout.dodopayments.com/session/${input.orderId}` };
    },
  };
}
function payment(id: string, checkout: string, amount: number, currency: string, paymentId = `pay_${id}`) {
  return { type: "payment.succeeded", data: {
    payload_type: "Payment", payment_id: paymentId, checkout_session_id: checkout,
    total_amount: amount, currency, metadata: { assessment_order_id: id },
  } };
}

for (const kind of ["json", "d1"] as const) describe(`Phase 1 ${kind} repository`, () => {
  it("persists patient type and retrieves the same Google subject after email/name changes", async () => {
    const { repo, reload } = fixture(kind);
    const account = await repo.upsertIdentity({ email: "old@example.com", name: "Old", googleSub: "google-stable-1" });
    await repo.setPatientType(account.id, "DOMESTIC");
    const again = await reload().upsertIdentity({ email: "new@example.com", name: "New", googleSub: "google-stable-1" });
    assert.equal(again.id, account.id);
    assert.equal(again.patientType, "DOMESTIC");
    assert.ok(again.updatedAt);
    await assert.rejects(repo.upsertIdentity({ email: "new@example.com", name: "Other", googleSub: "other-subject" }));
  });

  for (const type of ["DOMESTIC", "INTERNATIONAL"] as const) it(`uses server pricing for ${type}, confirms actual amount, and reuses duplicate attempts`, async () => {
    const { repo, reload } = fixture(kind);
    const account = await repo.upsertIdentity({ email: `${type}@example.com`, name: "Patient", googleSub: `sub-${type}` });
    await repo.setPatientType(account.id, type);
    const patient = await repo.getIdentityById(account.id);
    const deps = dependencies();
    const result = await startAssessmentCheckout(repo, patient, "https://dcredit.in", {
      ...fields, amountMinor: 1, currency: "EUR", patientType: "ATTACKER", productId: "client-product",
    }, deps);
    const price = assessmentPrice(type);
    assert.equal(result.order.amountMinor, price.amountMinor);
    assert.equal(result.order.currency, price.currency);
    assert.equal((await reload().assessments.get(result.order.id))?.status, "PENDING");
    assert.equal(await repo.setPatientType(account.id, type === "DOMESTIC" ? "INTERNATIONAL" : "DOMESTIC"), null);
    const second = await startAssessmentCheckout(repo, patient, "https://dcredit.in", fields, deps);
    assert.equal(second.url, result.url);
    assert.equal(deps.calls.length, 1);
    const pending = (await repo.assessments.get(result.order.id))!;
    const payload = payment(pending.id, pending.checkoutId!, price.amountMinor, price.currency);
    await applyAssessmentEvent(repo, payload, true, "development", "test_mode");
    const first = await repo.assessments.get(pending.id);
    assert.equal(first?.updatedAt, first?.confirmedAt);
    await applyAssessmentEvent(repo, payload, true, "development", "test_mode");
    assert.deepEqual(await repo.assessments.get(pending.id), first);
    await applyAssessmentEvent(repo, payload, false, "development", "test_mode");
    assert.equal((await repo.assessments.get(pending.id))?.status, "PAID");
    const third = await startAssessmentCheckout(repo, patient, "https://dcredit.in", fields, deps);
    assert.equal(third.url, "/account");
    assert.equal(deps.calls.length, 1);
    assert.equal((await repo.assessments.list(account.id)).length, 1);
    const view = toAccountView({ patient: patient!, applications: [], assessmentOrders: await repo.assessments.list(account.id) });
    assert.equal(view.initialAssessment?.amountMinor, price.amountMinor);
    assert.equal(view.initialAssessment?.currency, price.currency);
    assert.equal(view.initialAssessment?.status, "PAID");
    assert.equal(JSON.stringify(view).includes(pending.id), false);
  });

  it("blocks unauthenticated, unclassified, unacknowledged, production and live-mode attempts", async () => {
    const { repo } = fixture(kind);
    const deps = dependencies();
    await assert.rejects(startAssessmentCheckout(repo, null, "https://dcredit.in", fields, deps));
    const account = await repo.upsertIdentity({ email: "a@example.com", name: "A" });
    await assert.rejects(startAssessmentCheckout(repo, account, "https://dcredit.in", fields, deps));
    await repo.setPatientType(account.id, "DOMESTIC");
    const patient = await repo.getIdentityById(account.id);
    for (const config of [{ environment: "production" }, { providerEnvironment: "live_mode" }]) {
      await assert.rejects(startAssessmentCheckout(repo, patient, "https://dcredit.in", fields, { ...deps, ...config }));
    }
    await assert.rejects(startAssessmentCheckout(repo, patient, "https://dcredit.in", { ...fields, acknowledgePendingPolicy: "" }, deps));
    await assert.rejects(startAssessmentCheckout(repo, patient, "https://dcredit.in", fields, { ...deps, configured: () => false }));
    assert.equal((await repo.assessments.list(account.id)).length, 0);
    assert.equal(deps.calls.length, 0);
  });

  it("flags amount/currency mismatch, rejects incomplete confirmation and blocks further purchases", async () => {
    const { repo } = fixture(kind);
    const account = await repo.upsertIdentity({ email: "a@example.com", name: "A" });
    await repo.setPatientType(account.id, "DOMESTIC");
    const patient = await repo.getIdentityById(account.id);
    const result = await startAssessmentCheckout(repo, patient, "https://dcredit.in", fields, dependencies());
    const order = (await repo.assessments.get(result.order.id))!;
    await assert.rejects(applyAssessmentEvent(repo, { data: { metadata: { assessment_order_id: order.id } } }, true, "development", "test_mode"));
    assert.equal((await repo.assessments.get(order.id))?.status, "PENDING");
    await assert.rejects(applyAssessmentEvent(repo, payment(order.id, order.checkoutId!, 99900, "INR"), true, "production", "live_mode"));
    await applyAssessmentEvent(repo, payment(order.id, order.checkoutId!, 1, "USD"), true, "development", "test_mode");
    assert.equal((await repo.assessments.get(order.id))?.status, "REVIEW_REQUIRED");
    await assert.rejects(startAssessmentCheckout(repo, patient, "https://dcredit.in", fields, dependencies()));
  });

  it("allows a fresh unique attempt only after authoritative failure", async () => {
    const { repo } = fixture(kind);
    const account = await repo.upsertIdentity({ email: "a@example.com", name: "A" });
    await repo.setPatientType(account.id, "INTERNATIONAL");
    const patient = await repo.getIdentityById(account.id);
    const deps = dependencies();
    const first = await startAssessmentCheckout(repo, patient, "https://dcredit.in", fields, deps);
    const order = (await repo.assessments.get(first.order.id))!;
    await applyAssessmentEvent(repo, payment(order.id, order.checkoutId!, 1500, "USD"), false, "development", "test_mode");
    const next = await startAssessmentCheckout(repo, patient, "https://dcredit.in", fields, deps);
    assert.notEqual(next.order.id, first.order.id);
    // A late success on the failed attempt is retained for review, not a
    // second assessment activation while the replacement checkout is pending.
    await applyAssessmentEvent(repo, payment(order.id, order.checkoutId!, 1500, "USD"), true, "development", "test_mode");
    assert.equal((await repo.assessments.get(order.id))?.status, "REVIEW_REQUIRED");
    assert.equal((await repo.assessments.get(next.order.id))?.status, "PENDING");
  });

  it("allows only one concurrent active order and preserves historical $5 records", async () => {
    const { repo } = fixture(kind);
    const account = await repo.upsertIdentity({ email: "a@example.com", name: "A" });
    const legacy = await repo.createApplication({
      identityId: account.id, email: account.email, firstName: "A", lastName: "",
      phone: "", usState: "", country: "", procedureCategory: "", procedure: "",
      insuranceStatus: "", estimatedUsOop: "", preferredTimeline: "", preferredConsultationDate: "",
      sku: "orientation", amountCents: 500, currency: "usd",
    });
    await repo.confirmPayment({ id: legacy.id, paymentReference: "legacy-5-dollar", providerPaymentId: "pay_legacy" });
    const beforeApp = await repo.getApplicationById(legacy.id);
    const beforePayments = await repo.listPayments(legacy.id);
    await repo.setPatientType(account.id, "DOMESTIC");
    const attempts = await Promise.allSettled([
      repo.assessments.create(account.id, "DOMESTIC"), repo.assessments.create(account.id, "DOMESTIC"),
    ]);
    assert.equal(attempts.filter((attempt) => attempt.status === "fulfilled").length, 1);
    assert.deepEqual(await repo.getApplicationById(legacy.id), beforeApp);
    assert.deepEqual(await repo.listPayments(legacy.id), beforePayments);
  });
});

describe("Phase 1 provider/account boundaries", () => {
  it("blocks a production Node runtime even if APP_ENV was incorrectly left as development", () => {
    const original = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try { assert.equal(assessmentCheckoutAllowed("development", "test_mode"), false); }
    finally {
      if (original === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
      else Object.assign(process.env, { NODE_ENV: original });
    }
  });
  it("applies the additive D1 migration without changing existing $5 financial records", async () => {
    const { repo, sqlite } = fixture("d1", false);
    sqlite!.exec(`INSERT INTO identities (id, email, name, phone, country, created_at, google_sub)
      VALUES ('historical-test', 'historic@example.com', 'Historical test', '', '', '2025-01-01T00:00:00Z', 'historical-sub')`);
    const legacy = await repo.createApplication({
      identityId: "historical-test", email: "historic@example.com", firstName: "Historical", lastName: "",
      phone: "", usState: "", country: "", procedureCategory: "", procedure: "",
      insuranceStatus: "", estimatedUsOop: "", preferredTimeline: "", preferredConsultationDate: "",
      sku: "orientation", amountCents: 500, currency: "usd",
    });
    await repo.confirmPayment({ id: legacy.id, paymentReference: "historical-five", providerPaymentId: "pay_historical" });
    const beforeApplication = await repo.getApplicationById(legacy.id);
    const beforePayments = await repo.listPayments(legacy.id);
    sqlite!.exec(readFileSync(path.join(process.cwd(), "migrations/0004_initial_assessment.sql"), "utf8"));
    sqlite!.exec(readFileSync(path.join(process.cwd(), "migrations/0005_cashfree_assessment.sql"), "utf8"));
    await repo.setPatientType("historical-test", "DOMESTIC");
    const order = await repo.assessments.create("historical-test", "DOMESTIC");
    assert.ok(order.updatedAt);
    assert.deepEqual(await repo.getApplicationById(legacy.id), beforeApplication);
    assert.deepEqual(await repo.listPayments(legacy.id), beforePayments);
  });
  it("builds fixed currency and server product metadata, with no client-selected currency", () => {
    const old = process.env.DODO_PRODUCT_ID_INITIAL_ASSESSMENT_INR;
    process.env.DODO_PRODUCT_ID_INITIAL_ASSESSMENT_INR = "pdt_test_inr";
    try {
      const request = buildAssessmentCheckoutRequest({
        origin: "https://dcredit.in", email: "a@example.com", name: "A",
        patientType: "DOMESTIC", orderId: "server-order", currency: "USD",
      });
      assert.equal(request.billing_currency, "INR");
      assert.equal(request.feature_flags.allow_currency_selection, false);
      assert.equal(request.feature_flags.allow_discount_code, false);
      assert.equal(request.product_cart[0].product_id, "pdt_test_inr");
      assert.equal(request.metadata.assessment_order_id, "server-order");
      assert.equal(request.return_url, "https://dcredit.in/success?assessment=1");
    } finally {
      if (old === undefined) delete process.env.DODO_PRODUCT_ID_INITIAL_ASSESSMENT_INR;
      else process.env.DODO_PRODUCT_ID_INITIAL_ASSESSMENT_INR = old;
    }
  });
  it("refuses mismatched, discounted, variable, tax-exclusive or recurring remote products before opening checkout", async () => {
    const old = process.env.DODO_PRODUCT_ID_INITIAL_ASSESSMENT_INR;
    process.env.DODO_PRODUCT_ID_INITIAL_ASSESSMENT_INR = "pdt_test_inr";
    try {
      const opts = { origin: "https://dcredit.in", email: "a@example.com", name: "A", patientType: "DOMESTIC" as const, orderId: "test-order", currency: "INR" };
      const valid = { type: "one_time_price", price: 99900, currency: "INR", tax_inclusive: true };
      let sessions = 0;
      const checkoutSessions = { create: async () => { sessions++; return { session_id: "cks_test", checkout_url: "https://checkout.dodopayments.com/test" }; } };
      for (const patch of [{ price: 1 }, { currency: "USD" }, { discount_bps: 100 }, { purchasing_power_parity: true }, { pay_what_you_want: true }, { tax_inclusive: false }, { type: "recurring_price" }]) {
        await assert.rejects(createAssessmentCheckout(opts, { checkoutSessions, products: { retrieve: async () => ({ is_recurring: false, price: { ...valid, ...patch } }) } }));
      }
      assert.equal(sessions, 0);
      assert.equal((await createAssessmentCheckout(opts, { checkoutSessions, products: { retrieve: async () => ({ is_recurring: false, price: valid }) } }))?.id, "cks_test");
      assert.equal(sessions, 1);
    } finally {
      if (old === undefined) delete process.env.DODO_PRODUCT_ID_INITIAL_ASSESSMENT_INR;
      else process.env.DODO_PRODUCT_ID_INITIAL_ASSESSMENT_INR = old;
    }
  });
  it("does not expose another patient's assessment", async () => {
    const { repo } = fixture("json");
    const owner = await repo.upsertIdentity({ email: "a@example.com", name: "A" });
    const other = await repo.upsertIdentity({ email: "b@example.com", name: "B" });
    await repo.setPatientType(owner.id, "DOMESTIC");
    const order = await repo.assessments.create(owner.id, "DOMESTIC");
    const view = toAccountView({ patient: other, applications: [], assessmentOrders: [order] });
    assert.equal(view.initialAssessment, null);
  });
  it("rejects unverified Google email and accepts verified identity", async () => {
    const fetchBefore = globalThis.fetch;
    try {
      for (const verified of [false, true]) {
        let call = 0;
        globalThis.fetch = async () => new Response(JSON.stringify(call++ === 0
          ? { access_token: "test-token" }
          : { sub: "test-sub", email: "a@example.com", email_verified: verified, name: "A" }), { status: 200 });
        const result = await exchangeGoogleCode({ origin: "https://dcredit.in", code: "test-code", verifier: "test-verifier" });
        assert.equal(Boolean(result), verified);
      }
    } finally { globalThis.fetch = fetchBefore; }
  });
});
