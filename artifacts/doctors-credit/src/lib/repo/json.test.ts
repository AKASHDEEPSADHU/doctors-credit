import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { createJsonRepository } from "./json";

describe("ApplicationRepository (local durable store)", () => {
  it("does not mark paid until confirmPayment", async () => {
    const file = path.join(mkdtempSync(path.join(tmpdir(), "dc-")), "store.json");
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
    assert.match(app.applicationId, /^DC-\d{6}$/);
    assert.match(app.conversationVerificationId, /^CV-[A-Z0-9]{5}$/);
    assert.equal(app.paymentStatus, "PENDING");
    assert.equal(app.applicationStatus, "PAYMENT_PENDING");

    const unpaid = await repo.getApplicationByPublicId(app.applicationId);
    assert.equal(unpaid?.paymentStatus, "PENDING");

    const paid = await repo.confirmPayment({ id: app.id, paymentReference: "dodo_test" });
    assert.equal(paid?.paymentStatus, "PAID");
    assert.equal(paid?.applicationStatus, "PAID: CONSULTATION PENDING");
  });

  it("verifies call IDs without returning case data", async () => {
    const file = path.join(mkdtempSync(path.join(tmpdir(), "dc-")), "store.json");
    const repo = createJsonRepository(file);
    const call = await repo.createCallVerification("DC-000001", 60);
    const ok = await repo.verifyCallId(call.callId);
    assert.deepEqual(ok, { ok: true });
    const miss = await repo.verifyCallId("CALL-ZZZZZ");
    assert.equal(miss.ok, false);
    const replay = await repo.verifyCallId(call.callId);
    assert.equal(replay.ok, false);
  });

  it("rejects an expired call ID", async () => {
    const file = path.join(mkdtempSync(path.join(tmpdir(), "dc-")), "store.json");
    const repo = createJsonRepository(file);
    const call = await repo.createCallVerification("DC-000001", -1);
    const result = await repo.verifyCallId(call.callId);
    assert.equal(result.ok, false);
  });
});
