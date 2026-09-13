import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { applyPaymentSucceeded } from "./payment-events";
import { fulfillPaidApplication } from "./fulfillment";
import { conversationConfirmationText } from "./notifications";
import { createJsonRepository } from "./repo/json";
import { loadConfirmedApplication } from "./success-state";
import type { ZoomClient, ZoomMeeting } from "./zoom";

async function seed(slot = { date: "2026-09-21", time: "14:00" }) {
  const file = path.join(mkdtempSync(path.join(tmpdir(), "dc-ful-")), "store.json");
  const repo = createJsonRepository(file);
  const identity = await repo.upsertIdentity({ email: "pat@example.com", name: "Pat Example" });
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
    preferredConsultationDate: slot.date,
    appointmentTime: slot.time,
    appointmentTimezone: "America/New_York",
    sku: "orientation",
    amountCents: 500,
  });
  return { repo, identity, app };
}

function payload(applicationId: string, paymentId = "pay_one") {
  return {
    type: "payment.succeeded",
    data: {
      payment_id: paymentId,
      checkout_session_id: "cks_one",
      metadata: { application_id: applicationId, sku: "orientation" },
    },
  };
}

function mockZoom(calls: ZoomMeeting["meetingId"][] = [], join = "https://zoom.us/j/111") {
  const client: ZoomClient = {
    async createMeeting() {
      const id = `m${calls.length + 1}`;
      calls.push(id);
      return {
        provider: "zoom",
        meetingId: id,
        joinUrl: join,
        startTime: "2026-09-21T18:00:00Z",
        timezone: "America/New_York",
      };
    },
  };
  return { client, calls };
}

describe("payment fulfillment", () => {
  it("keeps the application PENDING and creates no Zoom meeting before payment", async () => {
    const { repo, app } = await seed();
    const zoom = mockZoom();
    const result = await fulfillPaidApplication(repo, app, {
      zoom: zoom.client,
      notify: { async sendConversationConfirmed() { return { sent: false, reason: "email_unconfigured" }; } },
    });
    assert.equal((await repo.getApplicationById(app.id))?.paymentStatus, "PENDING");
    assert.equal(result.meeting, "skipped");
    assert.equal(zoom.calls.length, 0);
  });

  it("does not create a Zoom meeting when checkout is only initiated", async () => {
    const { repo, app } = await seed();
    await repo.markPaymentInitiated(app.id, "cks_one");
    assert.equal((await repo.getApplicationById(app.id))?.paymentStatus, "PENDING");
    assert.equal((await repo.getApplicationById(app.id))?.meetingId, "");
  });

  it("does not create a Zoom meeting from the browser success page", async () => {
    const { repo, identity, app } = await seed();
    const zoom = mockZoom();
    await loadConfirmedApplication(repo, {
      pendingId: app.id,
      session: { patientId: identity.id, email: identity.email },
      returnQuery: { status: "succeeded" },
    });
    await fulfillPaidApplication(repo, (await repo.getApplicationById(app.id))!, {
      zoom: zoom.client,
      notify: { async sendConversationConfirmed() { return { sent: false, reason: "email_unconfigured" }; } },
    });
    assert.equal(zoom.calls.length, 0);
    assert.equal((await repo.getApplicationById(app.id))?.paymentStatus, "PENDING");
  });

  it("marks PAID and provisions Zoom exactly once after payment.succeeded", async () => {
    const { repo, app } = await seed();
    const zoom = mockZoom();
    const notices: string[] = [];
    const paid = await applyPaymentSucceeded(repo, payload(app.applicationId));
    assert.equal(paid.status, "paid");
    const first = await fulfillPaidApplication(repo, paid.application!, {
      zoom: zoom.client,
      notify: {
        async sendConversationConfirmed(current) {
          notices.push(current.applicationId);
          return { sent: true, reason: "sent" };
        },
      },
    });
    const secondPaid = await applyPaymentSucceeded(repo, payload(app.applicationId));
    const second = await fulfillPaidApplication(repo, secondPaid.application!, {
      zoom: zoom.client,
      notify: {
        async sendConversationConfirmed(current) {
          notices.push(current.applicationId);
          return { sent: true, reason: "sent" };
        },
      },
    });
    const stored = await repo.getApplicationById(app.id);
    assert.equal(stored?.paymentStatus, "PAID");
    assert.equal(first.meeting, "provisioned");
    assert.equal(second.meeting, "reused");
    assert.equal(second.notification, "already_sent");
    assert.equal(zoom.calls.length, 1);
    assert.equal(notices.length, 1);
    assert.equal(stored?.meetingJoinUrl, "https://zoom.us/j/111");
  });

  it("keeps PAID when Zoom fails and retries without creating a second meeting after success", async () => {
    const { repo, app } = await seed();
    const paid = await applyPaymentSucceeded(repo, payload(app.applicationId));
    let fail = true;
    const calls: string[] = [];
    const zoom: ZoomClient = {
      async createMeeting() {
        if (fail) {
          fail = false;
          throw new Error("zoom down");
        }
        calls.push("ok");
        return {
          provider: "zoom",
          meetingId: "retry-1",
          joinUrl: "https://zoom.us/j/retry",
          startTime: "2026-09-21T18:00:00Z",
          timezone: "America/New_York",
        };
      },
    };
    const failed = await fulfillPaidApplication(repo, paid.application!, {
      zoom,
      notify: { async sendConversationConfirmed() { return { sent: false, reason: "email_unconfigured" }; } },
    });
    assert.equal(failed.meeting, "failed");
    assert.equal((await repo.getApplicationById(app.id))?.paymentStatus, "PAID");
    assert.notEqual((await repo.getApplicationById(app.id))?.paymentStatus, "FAILED");

    const retried = await fulfillPaidApplication(repo, (await repo.getApplicationById(app.id))!, {
      zoom,
      notify: { async sendConversationConfirmed() { return { sent: false, reason: "email_unconfigured" }; } },
    });
    const again = await fulfillPaidApplication(repo, (await repo.getApplicationById(app.id))!, {
      zoom,
      notify: { async sendConversationConfirmed() { return { sent: false, reason: "email_unconfigured" }; } },
    });
    assert.equal(retried.meeting, "provisioned");
    assert.equal(again.meeting, "reused");
    assert.equal(calls.length, 1);
  });

  it("does not provision Zoom for an unknown or unpaid application", async () => {
    const { repo, app } = await seed();
    const zoom = mockZoom();
    const unknown = await applyPaymentSucceeded(repo, payload("DC-999999"));
    assert.equal(unknown.status, "not_found");
    await fulfillPaidApplication(repo, app, {
      zoom: zoom.client,
      notify: { async sendConversationConfirmed() { return { sent: false, reason: "email_unconfigured" }; } },
    });
    assert.equal(zoom.calls.length, 0);
    assert.equal((await repo.getApplicationById(app.id))?.meetingJoinUrl, "");
  });

  it("does not send procedure details, secrets, or host credentials to Zoom or email", async () => {
    const { repo, app } = await seed();
    const paid = await applyPaymentSucceeded(repo, payload(app.applicationId));
    let topic = "";
    await fulfillPaidApplication(repo, paid.application!, {
      zoom: {
        async createMeeting(input) {
          topic = input.topic;
          return {
            provider: "zoom",
            meetingId: "m1",
            joinUrl: "https://zoom.us/j/1",
            startTime: input.startTime,
            timezone: input.timezone,
          };
        },
      },
      notify: { async sendConversationConfirmed() { return { sent: true, reason: "sent" }; } },
    });
    const stored = await repo.getApplicationById(app.id);
    const email = conversationConfirmationText(stored!);
    assert.equal(topic, "DCredit Initial Assessment");
    assert.equal(/knee|MRI|ZOOM_CLIENT|DODO_PAYMENTS|start_url/i.test(topic), false);
    assert.equal(/Knee replacement|ZOOM_CLIENT|DODO_PAYMENTS|start_url/i.test(email), false);
    assert.match(email, /coordinator/);
  });
});
