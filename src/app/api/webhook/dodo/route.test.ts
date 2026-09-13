import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { describe, it } from "node:test";
import { Webhook } from "standardwebhooks";
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
