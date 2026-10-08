import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { describe, it } from "node:test";
import { ASSESSMENT_SERVICE, assessmentPrice } from "./assessment";
import { startAssessmentCheckout, type AssessmentCheckoutDeps } from "./assessment-checkout";
import { verifyAssessmentPayment } from "./assessment-verification";
import { processCashfreeWebhook } from "./cashfree-webhook";
import { applyAssessmentEvent } from "./assessment-events";
import { cashfreeOrderId, createCashfreeProvider, moneyMinor, normalizeCashfreePayment, parseCashfreeResponse, verifyCashfreeSignature } from "./payment-providers/cashfree";
import type { AssessmentProvider, PaymentAttempt } from "./payment-providers/types";
import { createJsonRepository } from "./repo/json";
import { createD1Repository, type D1Like } from "./repo/d1";
import { toAccountView } from "./account-view";

type SQLite = {
  exec(sql: string): void;
  prepare(sql: string): {
    get(...values: unknown[]): Record<string, unknown> | undefined;
    all(...values: unknown[]): Record<string, unknown>[];
    run(...values: unknown[]): unknown;
  };
};
const { DatabaseSync } = createRequire(import.meta.url)("node:sqlite") as { DatabaseSync: new (name: string) => SQLite };
function fixture(kind: "json" | "d1", migrate = true) {
  if (kind === "json") {
    const file = path.join(mkdtempSync(path.join(tmpdir(), "cashfree-")), "store.json");
    return { repo: createJsonRepository(file), reload: () => createJsonRepository(file), sqlite: null };
  }
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys=ON");
  for (const name of ["0001_init.sql", "0002_payment_provider.sql", "0003_appointment_meeting.sql", "0004_initial_assessment.sql",
    ...(migrate ? ["0005_cashfree_assessment.sql"] : [])]) sqlite.exec(readFileSync(path.join(process.cwd(), "migrations", name), "utf8"));
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
const fields = { service: ASSESSMENT_SERVICE, billingPhone: "+919876543210",
  acknowledgeService: "yes", acknowledgePrivacy: "yes", acknowledgePendingPolicy: "yes" };
const fixtureSecret = "not-a-merchant-credential-unit-fixture";
function providerFixture(type: "DOMESTIC" | "INTERNATIONAL" = "DOMESTIC") {
  const price = assessmentPrice(type);
  const state = { status: "ACTIVE", attempts: [] as PaymentAttempt[], usd: true, creates: [] as string[] };
  const provider: AssessmentProvider = {
    name: "cashfree", environment: () => "test_mode", configured: () => true,
    internationalAllowed: () => state.usd,
    create: async (input) => {
      state.creates.push(input.orderId);
      return { id: cashfreeOrderId(input.orderId), url: `/assessment/checkout?order=${input.orderId}` };
    },
    getOrder: async (id) => ({ id, ...price, status: state.status, sessionId: "noncredential-unit-session" }),
    getPayments: async () => state.attempts,
    verifyWebhook: (body, timestamp, signature) => verifyCashfreeSignature(body, timestamp, signature, fixtureSecret),
  };
  const deps: AssessmentCheckoutDeps = { environment: "development", providerEnvironment: "test_mode",
    provider: "cashfree", configured: provider.configured, internationalAllowed: provider.internationalAllowed, checkout: provider.create };
  return { provider, state, deps };
}
function attempt(status: string, amountMinor = 99900, currency = "INR", paymentId = "1453995084705707520"): PaymentAttempt {
  return { paymentId, status, amountMinor, currency, captured: status === "SUCCESS", adjusted: false };
}

for (const kind of ["json", "d1"] as const) describe(`Cashfree ${kind} persistence and security`, () => {
  async function setup(type: "DOMESTIC" | "INTERNATIONAL" = "DOMESTIC") {
    const f = fixture(kind);
    const account = await f.repo.upsertIdentity({ email: "sandbox@example.com", name: "Sandbox Patient", googleSub: "sandbox-sub" });
    const patient = (await f.repo.setPatientType(account.id, type))!;
    const p = providerFixture(type);
    return { ...f, ...p, patient };
  }
  for (const type of ["DOMESTIC", "INTERNATIONAL"] as const) it(`${type}: fixed server price, duplicate checkout, signed success, duplicate webhook, reload`, async () => {
    const { repo, reload, patient, provider, state, deps } = await setup(type);
    const result = await startAssessmentCheckout(repo, patient, "https://sandbox.example", {
      ...fields, amountMinor: 1, currency: "EUR", patientType: "ATTACKER", provider: "dodo",
    }, deps);
    assert.equal(result.order.paymentProvider, "cashfree");
    assert.equal(result.order.amountMinor, assessmentPrice(type).amountMinor);
    assert.equal(result.order.currency, assessmentPrice(type).currency);
    const duplicate = await startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps);
    assert.equal(duplicate.url, result.url);
    assert.equal(state.creates.length, 1);
    state.status = "PAID";
    state.attempts = [attempt("SUCCESS", assessmentPrice(type).amountMinor, assessmentPrice(type).currency)];
    const body = JSON.stringify({ type: "PAYMENT_SUCCESS_WEBHOOK", data: { order: { order_id: result.order.checkoutId || cashfreeOrderId(result.order.id) } } });
    const timestamp = String(Date.now());
    const signature = createHmac("sha256", fixtureSecret).update(timestamp + body).digest("base64");
    await assert.rejects(processCashfreeWebhook(repo, provider, body + " ", timestamp, signature, "2026-01-01"));
    assert.equal((await repo.assessments.get(result.order.id))?.status, "PENDING");
    await processCashfreeWebhook(repo, provider, body, timestamp, signature, "2026-01-01");
    const before = await reload().assessments.get(result.order.id);
    assert.equal(before?.status, "PAID");
    assert.equal(before?.confirmedCurrency, assessmentPrice(type).currency);
    assert.equal(before?.confirmedAmountMinor, assessmentPrice(type).amountMinor);
    await processCashfreeWebhook(repo, provider, body, timestamp, signature, "2026-01-01");
    assert.deepEqual(await reload().assessments.get(result.order.id), before);
    assert.equal((await repo.assessments.attempts(result.order.id)).length, 1);
    const view = toAccountView({ patient, applications: [], assessmentOrders: [before!] });
    assert.equal(view.initialAssessment?.status, "PAID");
    assert.ok(!JSON.stringify(view).includes("session"));
  });
  it("blocks unverified USD before reserving an order; never converts it", async () => {
    const { repo, patient, state, deps } = await setup("INTERNATIONAL");
    state.usd = false;
    await assert.rejects(startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps), /USD 15/);
    assert.equal((await repo.assessments.list(patient.id)).length, 0);
    assert.equal(state.creates.length, 0);
  });
  it("rejects unauthenticated order creation and invalid billing phone", async () => {
    const { repo, patient, deps } = await setup();
    await assert.rejects(startAssessmentCheckout(repo, null, "https://sandbox.example", fields, deps));
    await assert.rejects(startAssessmentCheckout(repo, patient, "https://sandbox.example", { ...fields, billingPhone: "bad" }, deps));
    assert.equal((await repo.assessments.list(patient.id)).length, 0);
  });
  it("persists failed/user-dropped attempts without closing the active order, then accepts success", async () => {
    const { repo, reload, patient, provider, state, deps } = await setup();
    const { order } = await startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps);
    state.attempts = [attempt("FAILED", 99900, "INR", "failed-attempt")];
    await verifyAssessmentPayment(repo, order.id, provider);
    state.attempts.push(attempt("USER_DROPPED", 99900, "INR", "dropped-attempt"));
    await verifyAssessmentPayment(repo, order.id, provider);
    assert.equal((await reload().assessments.get(order.id))?.status, "PENDING");
    assert.equal((await reload().assessments.attempts(order.id)).length, 2);
    await startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps);
    assert.equal(state.creates.length, 1);
    state.status = "PAID"; state.attempts.push(attempt("SUCCESS"));
    assert.equal((await verifyAssessmentPayment(repo, order.id, provider)).status, "PAID");
    // A late FAILED event triggers authoritative reconciliation, not a downgrade.
    assert.equal((await verifyAssessmentPayment(repo, order.id, provider)).status, "PAID");
  });
  for (const [amount, currency, adjusted] of [[99800, "INR", false], [99900, "USD", false], [99900, "INR", true]] as const) {
    it(`reviews confirmed amount/currency/adjustment mismatch: ${amount}/${currency}/${adjusted}`, async () => {
      const { repo, patient, provider, state, deps } = await setup();
      const { order } = await startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps);
      state.status = "PAID"; state.attempts = [{ ...attempt("SUCCESS", amount, currency), adjusted }];
      assert.equal((await verifyAssessmentPayment(repo, order.id, provider)).status, "REVIEW_REQUIRED");
      await assert.rejects(startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps));
    });
  }
  it("does not confirm a spoofed success when Cashfree still reports ACTIVE", async () => {
    const { repo, patient, provider, deps } = await setup();
    const { order } = await startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps);
    const body = JSON.stringify({ type: "PAYMENT_SUCCESS_WEBHOOK", data: { order: { order_id: cashfreeOrderId(order.id) } } });
    const timestamp = String(Date.now());
    const signature = createHmac("sha256", fixtureSecret).update(timestamp + body).digest("base64");
    await processCashfreeWebhook(repo, provider, body, timestamp, signature, "2026-01-01");
    assert.equal((await repo.assessments.get(order.id))?.status, "PENDING");
    await assert.rejects(processCashfreeWebhook(repo, provider, body, timestamp, signature, "2023-08-01"));
  });
  it("only closes a verified terminal unpaid order", async () => {
    const { repo, patient, provider, state, deps } = await setup();
    const { order } = await startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps);
    state.status = "EXPIRED"; state.attempts = [attempt("USER_DROPPED")];
    assert.equal((await verifyAssessmentPayment(repo, order.id, provider)).status, "FAILED");
  });
  it("blocks Dodo events from mutating a Cashfree order", async () => {
    const { repo, patient, deps } = await setup();
    const { order } = await startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps);
    await assert.rejects(applyAssessmentEvent(repo, { data: { metadata: { assessment_order_id: order.id } } }, false, "development", "test_mode"));
    assert.equal((await repo.assessments.get(order.id))?.status, "PENDING");
  });
  it("preserves both successful attempts for duplicate-charge review", async () => {
    const { repo, patient, provider, state, deps } = await setup();
    const { order } = await startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps);
    state.status = "PAID"; state.attempts = [attempt("SUCCESS")];
    const paid = await verifyAssessmentPayment(repo, order.id, provider);
    state.attempts.push(attempt("SUCCESS", 99900, "INR", "second-success"));
    const reviewed = await verifyAssessmentPayment(repo, order.id, provider);
    assert.equal(reviewed.paymentId, paid.paymentId);
    assert.equal(reviewed.reviewReason, "duplicate_successful_payment");
    assert.equal((await repo.assessments.attempts(order.id)).length, 2);
  });
  it("retries uncertain creation with the same internal order, never a second assessment", async () => {
    const { repo, patient, state, deps } = await setup();
    let first = true;
    const create = deps.checkout;
    deps.checkout = async (input) => { if (first) { first = false; throw new Error("simulated timeout"); } return create(input); };
    await assert.rejects(startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps));
    const pending = (await repo.assessments.list(patient.id))[0];
    const retried = await startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps);
    assert.equal(retried.order.id, pending.id);
    assert.equal((await repo.assessments.list(patient.id)).length, 1);
    assert.equal(state.creates.length, 1);
  });
  it("reserves only one assessment and provider checkout under concurrent submissions", async () => {
    const { repo, patient, state, deps } = await setup();
    const results = await Promise.allSettled([
      startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps),
      startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps),
    ]);
    assert.ok(results.some((result) => result.status === "fulfilled"));
    assert.equal((await repo.assessments.list(patient.id)).length, 1);
    assert.equal(state.creates.length, 1);
  });
  it("preserves historical $5 records across the migration and Cashfree flow", async () => {
    const { repo, sqlite } = fixture(kind, false);
    const identity = await repo.upsertIdentity({ email: "historic@example.com", name: "Historical" });
    const legacy = await repo.createApplication({
      identityId: identity.id, email: identity.email, firstName: identity.name, lastName: "",
      phone: "", usState: "", country: "", procedureCategory: "", procedure: "",
      insuranceStatus: "", estimatedUsOop: "", preferredTimeline: "", preferredConsultationDate: "",
      sku: "orientation", amountCents: 500, currency: "usd",
    });
    await repo.confirmPayment({ id: legacy.id, paymentReference: "historic-five", providerPaymentId: "pay_historic" });
    const before = { application: await repo.getApplicationById(legacy.id), payments: await repo.listPayments(legacy.id) };
    if (sqlite) sqlite.exec(readFileSync(path.join(process.cwd(), "migrations/0005_cashfree_assessment.sql"), "utf8"));
    const patient = (await repo.setPatientType(identity.id, "DOMESTIC"))!;
    const { provider, state, deps } = providerFixture();
    const { order } = await startAssessmentCheckout(repo, patient, "https://sandbox.example", fields, deps);
    state.status = "PAID"; state.attempts = [attempt("SUCCESS")];
    await verifyAssessmentPayment(repo, order.id, provider);
    assert.deepEqual({ application: await repo.getApplicationById(legacy.id), payments: await repo.listPayments(legacy.id) }, before);
  });
});

describe("Cashfree adapter protocol", () => {
  it("uses only sandbox endpoints, stable idempotency, exact server prices and NO notify_url", async () => {
    const values = {
      CASHFREE_ENVIRONMENT: "sandbox", CASHFREE_CLIENT_ID: "unit-fixture-client",
      CASHFREE_CLIENT_SECRET: fixtureSecret, CASHFREE_PUBLIC_ORIGIN: "https://sandbox.example",
      CASHFREE_API_VERSION: "2026-01-01", CASHFREE_USD_SANDBOX_VERIFIED: "true",
    };
    const previous = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
    Object.assign(process.env, values);
    try {
      for (const type of ["DOMESTIC", "INTERNATIONAL"] as const) {
        const id = "12345678-abcd-4abc-8abc-123456789abc";
        const calls: { url: string; init?: RequestInit }[] = [];
        const provider = createCashfreeProvider(async (url, init) => {
          calls.push({ url: String(url), init });
          if (init?.method !== "POST") return new Response("{}", { status: 404 });
          const payload = JSON.parse(String(init.body));
          assert.equal(payload.order_amount, assessmentPrice(type).amountMinor / 100);
          assert.equal(payload.order_currency, assessmentPrice(type).currency);
          assert.ok(!("notify_url" in payload.order_meta));
          assert.ok(!("discount" in payload));
          assert.equal(new Headers(init.headers).get("x-idempotency-key"), id);
          assert.equal(new Headers(init.headers).get("x-api-version"), "2026-01-01");
          return Response.json({ order_id: cashfreeOrderId(id), order_amount: payload.order_amount,
            order_currency: payload.order_currency, order_status: "ACTIVE", payment_session_id: "unit-session" });
        });
        await provider.create({ origin: "https://sandbox.example", email: "unit@example.com", name: "Unit",
          phone: "+919876543210", patientType: type, orderId: id, currency: "EUR" });
        assert.equal(calls.length, 2);
        assert.ok(calls.every((call) => call.url.startsWith("https://sandbox.cashfree.com/pg/")));
      }
      process.env.CASHFREE_ENVIRONMENT = "production";
      await assert.rejects(createCashfreeProvider(async () => { throw new Error("must not call"); }).getOrder("x"));
    } finally {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[key]; else process.env[key] = value;
      }
    }
  });
  it("strictly verifies raw body/timestamp and refuses malformed money and unsafe IDs", () => {
    const timestamp = String(Date.now()), body = '{"amount":999.00}';
    const signature = createHmac("sha256", fixtureSecret).update(timestamp + body).digest("base64");
    assert.equal(verifyCashfreeSignature(body, timestamp, signature, fixtureSecret), true);
    assert.equal(verifyCashfreeSignature('{"amount":999}', timestamp, signature, fixtureSecret), false);
    assert.equal(verifyCashfreeSignature(body, timestamp + "1", signature, fixtureSecret), false);
    assert.equal(verifyCashfreeSignature(body, timestamp, "invalid", fixtureSecret), false);
    assert.equal(moneyMinor("999.00"), 99900);
    assert.throws(() => moneyMinor("999.001"));
    assert.throws(() => normalizeCashfreePayment({ order_id: "x", cf_payment_id: 1453995084705707520 }, "x"));
  });
  it("preserves the exact reference when Cashfree sends a large numeric JSON ID", () => {
    const parsed = parseCashfreeResponse('{"order_id":"x","cf_payment_id":1453995084705707521,"payment_status":"SUCCESS","payment_amount":999,"payment_currency":"INR","is_captured":true}');
    assert.equal(normalizeCashfreePayment(parsed, "x").paymentId, "1453995084705707521");
  });
});
