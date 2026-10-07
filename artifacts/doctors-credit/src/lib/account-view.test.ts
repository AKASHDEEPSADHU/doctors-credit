import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { accountHasInternalIds, toAccountView } from "./account-view";
import { loadConfirmedApplication } from "./success-state";
import type { Application, Identity } from "./repo/types";

function identity(id: string, email: string): Identity {
  return { id, email, name: "Pat Example", phone: "", country: "", createdAt: "2026-09-13T00:00:00.000Z" };
}

function app(partial: Partial<Application> & Pick<Application, "id" | "identityId" | "applicationId">): Application {
  return {
    conversationVerificationId: "CV-AAAAA",
    firstName: "Pat",
    lastName: "Example",
    email: "pat@example.com",
    phone: "555-0100",
    usState: "CA",
    country: "United States",
    procedureCategory: "Orthopedics",
    procedure: "Knee replacement",
    insuranceStatus: "Private insurance",
    estimatedUsOop: "unknown",
    preferredTimeline: "Flexible / exploring",
    preferredConsultationDate: "2026-09-21",
    appointmentTime: "14:00",
    appointmentTimezone: "America/New_York",
    meetingProvider: "",
    meetingId: "",
    meetingJoinUrl: "",
    meetingStartsAt: "",
    meetingTimezone: "",
    meetingStatus: "",
    notificationStatus: "",
    paymentStatus: "PENDING",
    paymentReference: "",
    sku: "orientation",
    amountCents: 500,
    currency: "usd",
    applicationStatus: "PAYMENT_PENDING",
    assignedCoordinator: "",
    lastContactDate: "",
    nextFollowupDate: "2026-09-21",
    source: "dcredit.in",
    notes: "",
    sheetsSyncStatus: "pending",
    sheetsSyncError: "",
    createdAt: "2026-09-13T00:00:00.000Z",
    updatedAt: "2026-09-13T00:00:00.000Z",
    ...partial,
  };
}

describe("account view", () => {
  it("shows the signed-in name, email, and selected slot without internal ids", () => {
    const view = toAccountView({
      patient: identity("internal-user-1", "pat@example.com"),
      applications: [app({ id: "internal-app-1", identityId: "internal-user-1", applicationId: "DC-000001" })],
    });
    assert.equal(view.patient.name, "Pat Example");
    assert.equal(view.patient.email, "pat@example.com");
    assert.equal(view.assessment?.paymentLabel, "Assessment not yet paid");
    assert.equal(view.assessment?.appointment?.timeLabel, "2:00 PM");
    assert.equal(view.assessment?.appointment?.timezoneLabel.length ? true : false, true);
    assert.equal(view.assessment?.applicationId, undefined);
    assert.equal(accountHasInternalIds(view), false);
    assert.equal(JSON.stringify(view).includes("internal-user-1"), false);
    assert.equal(JSON.stringify(view).includes("internal-app-1"), false);
  });

  it("does not expose a Zoom join URL before payment", () => {
    const view = toAccountView({
      patient: identity("u1", "pat@example.com"),
      applications: [
        app({
          id: "a1",
          identityId: "u1",
          applicationId: "DC-000002",
          meetingStatus: "provisioned",
          meetingJoinUrl: "https://zoom.us/j/secret",
        }),
      ],
    });
    assert.equal(view.assessment?.meeting, null);
    assert.equal(JSON.stringify(view).includes("zoom.us"), false);
  });

  it("shows paid confirmation and join URL only for the signed-in patient's application", async () => {
    const mine = app({
      id: "mine",
      identityId: "user-a",
      applicationId: "DC-000010",
      paymentStatus: "PAID",
      meetingStatus: "provisioned",
      meetingJoinUrl: "https://zoom.us/j/mine",
    });
    const theirs = app({
      id: "theirs",
      identityId: "user-b",
      applicationId: "DC-000011",
      paymentStatus: "PAID",
      meetingStatus: "provisioned",
      meetingJoinUrl: "https://zoom.us/j/theirs",
    });
    const view = toAccountView({
      patient: identity("user-a", "a@example.com"),
      applications: [mine],
    });
    assert.equal(view.assessment?.applicationId, "DC-000010");
    assert.equal(view.assessment?.meeting?.joinUrl, "https://zoom.us/j/mine");
    assert.equal(JSON.stringify(view).includes("theirs"), false);

    const loaded = await loadConfirmedApplication(
      {
        getApplicationById: async (id: string) => (id === theirs.id ? theirs : null),
        listApplicationsForIdentity: async (id: string) => (id === "user-a" ? [] : [theirs]),
      } as never,
      { pendingId: theirs.id, session: { patientId: "user-a", email: "a@example.com" } }
    );
    assert.equal(loaded, null);
    assert.notEqual(view.assessment?.meeting?.joinUrl, theirs.meetingJoinUrl);
  });
});
