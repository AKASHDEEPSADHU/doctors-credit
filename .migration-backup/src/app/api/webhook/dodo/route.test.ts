import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { describe, it } from "node:test";
import { Webhook } from "standardwebhooks";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createJsonRepository } from "@/lib/repo/json";
import { createDodoWebhookPost } from "./route";

const TEST_KEY = `whsec_${Buffer.from("dcredit-test-webhook-secret-key").toString("base64")}`;

function post(body: string, headers: Record<string, string> = {}) {
  return new NextRequest("https://dcredit.in/api/webhook/dodo", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

describe("Dodo webhook signatures", () => {
  it("confirms a complete signed assessment event once, without legacy fulfillment or Sheets", async () => {
    const repo = createJsonRepository(path.join(mkdtempSync(path.join(tmpdir(), "dcredit-signed-")), "store.json"));
    const patient = await repo.upsertIdentity({ email: "signed-test@example.com", name: "Signed test" });
    await repo.setPatientType(patient.id, "DOMESTIC");
    const order = await repo.assessments.create(patient.id, "DOMESTIC");
    await repo.assessments.initiate(order.id, "cks_signed", "https://checkout.dodopayments.com/test");
    let fulfillmentCalls = 0;
    let sheetsCalls = 0;
    repo.retryPendingSheetsSync = async () => { sheetsCalls++; return 0; };
    const POST = createDodoWebhookPost({
      webhookKey: () => TEST_KEY, getRepository: async () => repo,
      fulfill: async () => { fulfillmentCalls++; throw new Error("Assessment must not trigger legacy fulfillment."); },
    });
    const signed = JSON.stringify({
      business_id: "test-business", type: "payment.succeeded", timestamp: new Date().toISOString(),
      data: {
        payload_type: "Payment", billing: { city: null, country: "IN", state: null, street: null, zipcode: null },
        brand_id: "test-brand", business_id: "test-business", created_at: new Date().toISOString(),
        currency: "INR", customer: { customer_id: "test-customer", email: patient.email, name: patient.name },
        digital_products_delivered: false, disputes: [], is_update_payment_method: false,
        metadata: { assessment_order_id: order.id }, payment_id: "pay_signed", payment_provider: "dodo",
        refunds: [], retry_attempt: 0, settlement_amount: 99900, settlement_currency: "INR",
        total_amount: 99900, checkout_session_id: "cks_signed", status: "succeeded",
      },
    });
    const now = new Date();
    const signature = new Webhook(TEST_KEY).sign("msg_signed", now, signed);
    const headers = {
      "webhook-id": "msg_signed", "webhook-timestamp": String(Math.floor(now.getTime() / 1000)),
      "webhook-signature": signature,
    };
    assert.equal((await POST(post(signed, { ...headers, "webhook-signature": "v1,forged" }))).status, 401);
    assert.equal((await repo.assessments.get(order.id))?.status, "PENDING");
    assert.equal((await POST(post(signed, headers))).status, 200);
    const paid = await repo.assessments.get(order.id);
    assert.equal(paid?.status, "PAID");
    assert.equal(paid?.confirmedAmountMinor, 99900);
    assert.equal(paid?.confirmedCurrency, "INR");
    assert.equal((await POST(post(signed, headers))).status, 200);
    assert.deepEqual(await repo.assessments.get(order.id), paid);
    assert.equal(fulfillmentCalls, 0);
    assert.equal(sheetsCalls, 0);
    assert.equal((await repo.listApplicationsForIdentity(patient.id)).length, 0);
  });
  it("rejects a missing webhook key", async () => {
    const POST = createDodoWebhookPost({
      webhookKey: () => "",
      getRepository: async () => {
        throw new Error("repo should not run");
      },
    });
    const res = await POST(post(JSON.stringify({ type: "payment.succeeded" })));
    assert.equal(res.status, 503);
  });

  it("rejects a missing signature", async () => {
    const POST = createDodoWebhookPost({
      webhookKey: () => TEST_KEY,
      getRepository: async () => {
        throw new Error("repo should not run");
      },
    });
    const res = await POST(post(JSON.stringify({ type: "payment.succeeded" })));
    assert.equal(res.status, 401);
  });

  it("rejects an invalid signature", async () => {
    const POST = createDodoWebhookPost({
      webhookKey: () => TEST_KEY,
      getRepository: async () => {
        throw new Error("repo should not run");
      },
    });
    const res = await POST(
      post(JSON.stringify({ type: "payment.succeeded" }), {
        "webhook-id": "msg_test",
        "webhook-timestamp": String(Math.floor(Date.now() / 1000)),
        "webhook-signature": "v1,not-a-valid-signature",
      })
    );
    assert.equal(res.status, 401);
  });

  it("rejects a signed but malformed payload without touching the store", async () => {
    const signed = JSON.stringify({ not: "a dodo webhook" });
    const now = new Date();
    const webhookId = "msg_malformed";
    const signature = new Webhook(TEST_KEY).sign(webhookId, now, signed);
    let repoCalled = false;
    const POST = createDodoWebhookPost({
      webhookKey: () => TEST_KEY,
      getRepository: async () => {
        repoCalled = true;
        throw new Error("repo should not run");
      },
    });
    const res = await POST(
      post(signed, {
        "webhook-id": webhookId,
        "webhook-timestamp": String(Math.floor(now.getTime() / 1000)),
        "webhook-signature": signature,
      })
    );
    assert.equal(res.status, 400);
    assert.equal(repoCalled, false);
  });

  it("does not accept a signed payload as paid without fulfillment", async () => {
    const signed = JSON.stringify({ type: "payment.processing" });
    const now = new Date();
    const webhookId = "msg_processing";
    const signature = new Webhook(TEST_KEY).sign(webhookId, now, signed);
    let repoCalled = false;
    const POST = createDodoWebhookPost({
      webhookKey: () => TEST_KEY,
      getRepository: async () => {
        repoCalled = true;
        throw new Error("repo should not mark paid for processing");
      },
    });
    const res = await POST(
      post(signed, {
        "webhook-id": webhookId,
        "webhook-timestamp": String(Math.floor(now.getTime() / 1000)),
        "webhook-signature": signature,
      })
    );
    assert.notEqual(res.status, 401);
    assert.equal(repoCalled, false);
  });
});
