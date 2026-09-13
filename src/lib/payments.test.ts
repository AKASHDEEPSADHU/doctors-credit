import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";
import { evaluateCheckoutAccess, resolveCheckoutProduct } from "./checkout-policy";
import {
  buildCheckoutSessionRequest,
  createCheckout,
  paymentRefsFromPayload,
  serverCheckoutMetadata,
} from "./dodo";
import { turnstileRequired } from "./env";
import { applyPaymentFailed, applyPaymentSucceeded } from "./payment-events";
import { createJsonRepository } from "./repo/json";
import { loadConfirmedApplication } from "./success-state";
import { verifyTurnstile } from "./turnstile";

const envKeys = [
  "APP_ENV",
  "DODO_PAYMENTS_API_KEY",
  "DODO_PAYMENTS_WEBHOOK_KEY",
  "DODO_PAYMENTS_ENVIRONMENT",
  "DODO_PAYMENTS_RETURN_URL",
  "DODO_PRODUCT_ID_ORIENTATION",
  "TURNSTILE_SECRET_KEY",
] as const;
const snapshot = Object.fromEntries(envKeys.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const key of envKeys) {
    if (snapshot[key] === undefined) delete process.env[key];
    else process.env[key] = snapshot[key];
  }
});

async function seedApplication() {
  const file = path.join(mkdtempSync(path.join(tmpdir(), "dc-pay-")), "store.json");
  const repo = createJsonRepository(file);
  const identity = await repo.upsertIdentity({
    email: "pat@example.com",
    name: "Pat Example",
  });
  const app = await repo.createApplication({
    identityId: identity.id,
    email: identity.email,
    firstName: "Pat",
    lastName: "Example",
    phone: "555-0100",
    usState: "CA",
    country: "United States",
    procedureCategory: "Orthopedics",
    procedure: "Knee replacement",
    insuranceStatus: "Private insurance",
    estimatedUsOop: "unknown",
    preferredTimeline: "Flexible / exploring",
    preferredConsultationDate: "2026-10-01",
    sku: "orientation",
    amountCents: 500,
  });
  return { repo, identity, app };
}

function succeededPayload(applicationId: string, extras: Record<string, unknown> = {}) {
  return {
    type: "payment.succeeded",
    data: {
      payload_type: "Payment",
      payment_id: extras.payment_id || "pay_test_orientation",
      checkout_session_id: extras.checkout_session_id || "cks_test_orientation",
      metadata: { application_id: applicationId, sku: "orientation" },
    },
  };
}

describe("checkout access and V1 product control", () => {
  it("cannot start checkout without authentication", () => {
    assert.deepEqual(evaluateCheckoutAccess(null), { ok: false, reason: "unauthenticated" });
    assert.equal(evaluateCheckoutAccess({ patientId: "p1", email: "a@b.com" }).ok, true);
  });

  it("rejects future SKUs and ignores client amount or product id", () => {
    assert.equal(resolveCheckoutProduct({ sku: "direction", amountCents: 45000 }).ok, false);
    assert.equal(resolveCheckoutProduct({ sku: "journey", amountCents: 240000 }).ok, false);
    const orientation = resolveCheckoutProduct({
      sku: "orientation",
      amountCents: 240000,
      productId: "pdt_client_supplied",
    });
    assert.equal(orientation.ok, true);
    if (orientation.ok) {
      assert.equal(orientation.sku, "orientation");
      assert.equal(orientation.amountCents, 500);
    }
  });
});

describe("Dodo checkout is server-side", () => {
  it("builds metadata and product from server values only", () => {
    process.env.DODO_PRODUCT_ID_ORIENTATION = "pdt_server_orientation";
    process.env.DODO_PAYMENTS_RETURN_URL = "https://dcredit.in/success";
    const body = buildCheckoutSessionRequest({
      origin: "https://evil.example",
      email: "pat@example.com",
      name: "Pat Example",
      sku: "orientation",
      applicationId: "DC-000042",
      productId: process.env.DODO_PRODUCT_ID_ORIENTATION,
    });
    assert.deepEqual(body.product_cart, [{ product_id: "pdt_server_orientation", quantity: 1 }]);
    assert.deepEqual(body.metadata, serverCheckoutMetadata("DC-000042", "orientation"));
    assert.equal(body.metadata.application_id, "DC-000042");
    assert.equal(body.return_url, "https://dcredit.in/success");
    assert.equal("amount" in body, false);
    assert.equal("amount_cents" in body, false);
  });

  it("fails closed when the server product id is missing", async () => {
    delete process.env.DODO_PRODUCT_ID_ORIENTATION;
    let called = false;
    const checkout = await createCheckout(
      {
        origin: "https://dcredit.in",
        email: "pat@example.com",
        name: "Pat Example",
        sku: "orientation",
        applicationId: "DC-000007",
      },
      {
        checkoutSessions: {
          async create() {
            called = true;
            return { session_id: "cks_should_not_run", checkout_url: "https://example.com" };
          },
        },
      }
    );
    assert.equal(checkout, null);
    assert.equal(called, false);
  });

  it("creates checkout through the injected server client", async () => {
    process.env.DODO_PRODUCT_ID_ORIENTATION = "pdt_server_orientation";
    let captured: unknown;
    const checkout = await createCheckout(
      {
        origin: "https://dcredit.in",
        email: "pat@example.com",
        name: "Pat Example",
        sku: "orientation",
        applicationId: "DC-000007",
      },
      {
        checkoutSessions: {
          async create(body) {
            captured = body;
            return { session_id: "cks_server", checkout_url: "https://checkout.dodopayments.com/session/cks_server" };
          },
        },
      }
    );
    assert.equal(checkout?.id, "cks_server");
    assert.equal(checkout?.url, "https://checkout.dodopayments.com/session/cks_server");
    const body = captured as ReturnType<typeof buildCheckoutSessionRequest>;
    assert.equal(body.product_cart[0].product_id, "pdt_server_orientation");
    assert.deepEqual(body.metadata, { application_id: "DC-000007", sku: "orientation" });
  });
});

describe("payment confirmation", () => {
  it("marks only the matching application PAID", async () => {
    const { repo, app } = await seedApplication();
    const other = await repo.createApplication({
      identityId: app.identityId,
      email: app.email,
      firstName: "Pat",
      lastName: "Example",
      phone: app.phone,
      usState: app.usState,
      country: app.country,
      procedureCategory: app.procedureCategory,
      procedure: app.procedure,
      insuranceStatus: app.insuranceStatus,
      estimatedUsOop: app.estimatedUsOop,
      preferredTimeline: app.preferredTimeline,
      preferredConsultationDate: app.preferredConsultationDate,
      sku: "orientation",
      amountCents: 500,
    });
    const result = await applyPaymentSucceeded(repo, succeededPayload(app.applicationId));
    assert.equal(result.status, "paid");
    assert.equal(result.application?.paymentStatus, "PAID");
    assert.equal(result.application?.applicationId, app.applicationId);
    assert.equal((await repo.getApplicationById(other.id))?.paymentStatus, "PENDING");
  });

  it("is idempotent for duplicate payment.succeeded", async () => {
    const { repo, app } = await seedApplication();
    const first = await applyPaymentSucceeded(repo, succeededPayload(app.applicationId));
    const second = await applyPaymentSucceeded(repo, succeededPayload(app.applicationId));
    assert.equal(first.status, "paid");
    assert.equal(second.status, "already_paid");
    assert.equal((await repo.getApplicationById(app.id))?.paymentStatus, "PAID");
    assert.equal((await repo.listPayments(app.id)).length, 1);
  });

  it("does not mark PAID on payment.failed", async () => {
    const { repo, app } = await seedApplication();
    const result = await applyPaymentFailed(repo, {
      type: "payment.failed",
      data: {
        payment_id: "pay_failed",
        metadata: { application_id: app.applicationId },
      },
    });
    assert.equal(result.status, "failed");
    assert.equal(result.application?.paymentStatus, "FAILED");
    assert.notEqual(result.application?.paymentStatus, "PAID");
  });

  it("does not mark anything paid for an unknown application id", async () => {
    const { repo, app } = await seedApplication();
    await repo.markPaymentInitiated(app.id, "cks_test_orientation");
    const result = await applyPaymentSucceeded(repo, succeededPayload("DC-999999"));
    assert.equal(result.status, "not_found");
    assert.equal(result.application, null);
    assert.equal((await repo.getApplicationById(app.id))?.paymentStatus, "PENDING");
    assert.equal((await repo.listPayments(app.id)).length, 0);
  });

  it("does not attach a malformed application id to another application", async () => {
    const { repo, app } = await seedApplication();
    await repo.markPaymentInitiated(app.id, "cks_owned_by_real_app");
    const result = await applyPaymentSucceeded(
      repo,
      succeededPayload("not-an-application", {
        payment_id: "pay_other",
        checkout_session_id: "cks_owned_by_real_app",
      })
    );
    assert.equal(result.status, "not_found");
    assert.equal((await repo.getApplicationById(app.id))?.paymentStatus, "PENDING");
  });

  it("can reconcile by checkout id when metadata is absent", async () => {
    const { repo, app } = await seedApplication();
    await repo.markPaymentInitiated(app.id, "cks_from_session");
    const result = await applyPaymentSucceeded(repo, {
      type: "payment.succeeded",
      data: {
        payment_id: "pay_from_session",
        checkout_session_id: "cks_from_session",
        metadata: {},
      },
    });
    assert.equal(result.status, "paid");
    assert.equal(result.application?.applicationId, app.applicationId);
  });

  it("does not change an already-PAID application after payment.failed", async () => {
    const { repo, app } = await seedApplication();
    await applyPaymentSucceeded(repo, succeededPayload(app.applicationId));
    const failed = await applyPaymentFailed(repo, {
      type: "payment.failed",
      data: {
        payment_id: "pay_test_orientation",
        metadata: { application_id: app.applicationId },
      },
    });
    assert.equal(failed.status, "ignored");
    assert.equal((await repo.getApplicationById(app.id))?.paymentStatus, "PAID");
  });

  it("does not treat a browser return as payment confirmation", async () => {
    const { repo, identity, app } = await seedApplication();
    const confirmCalls: unknown[] = [];
    const original = repo.confirmPayment.bind(repo);
    repo.confirmPayment = async (input) => {
      confirmCalls.push(input);
      return original(input);
    };
    const loaded = await loadConfirmedApplication(repo, {
      pendingId: app.id,
      session: { patientId: identity.id, email: identity.email },
      returnQuery: { status: "succeeded", payment_id: "pay_browser", session_id: "cks_browser" },
    });
    assert.equal(loaded, null);
    assert.equal(confirmCalls.length, 0);
    assert.equal((await repo.getApplicationById(app.id))?.paymentStatus, "PENDING");
  });

  it("rejects Turnstile in deployed environments when the token is missing", async () => {
    process.env.APP_ENV = "production";
    delete process.env.TURNSTILE_SECRET_KEY;
    assert.equal(turnstileRequired(), true);
    assert.equal(await verifyTurnstile(""), false);
    assert.equal(await verifyTurnstile(null), false);
    process.env.TURNSTILE_SECRET_KEY = "test-turnstile-secret";
    assert.equal(await verifyTurnstile(""), false);
  });

  it("extracts server-controlled application metadata", () => {
    const refs = paymentRefsFromPayload(succeededPayload("DC-000123"));
    assert.equal(refs.applicationId, "DC-000123");
    assert.equal(refs.providerPaymentId, "pay_test_orientation");
    assert.equal(refs.providerCheckoutId, "cks_test_orientation");
  });
});
