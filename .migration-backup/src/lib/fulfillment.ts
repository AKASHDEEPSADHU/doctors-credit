import { createEmailNotificationClient, notifyConversationConfirmed, type NotificationClient } from "@/lib/notifications";
import type { ApplicationRepository } from "@/lib/repo/interface";
import type { Application } from "@/lib/repo/types";
import { createZoomClient, ZoomUnconfiguredError, type ZoomClient } from "@/lib/zoom";

export type FulfillmentDeps = {
  zoom?: ZoomClient;
  notify?: NotificationClient;
};

export type FulfillmentResult = {
  application: Application;
  meeting: "provisioned" | "reused" | "failed" | "slot_unavailable" | "skipped";
  notification: "sent" | "skipped" | "already_sent" | "failed";
};

async function otherPaidCountForSlot(repo: ApplicationRepository, app: Application) {
  if (!app.preferredConsultationDate || !app.appointmentTime) return 0;
  const occupancy = await repo.listPaidSlotOccupancy();
  const row = occupancy.find(
    (item) => item.date === app.preferredConsultationDate && item.time === app.appointmentTime
  );
  return Math.max(0, (row?.count || 0) - 1);
}

async function provisionMeeting(
  repo: ApplicationRepository,
  app: Application,
  zoom: ZoomClient
): Promise<{ app: Application; meeting: FulfillmentResult["meeting"] }> {
  if (app.meetingStatus === "provisioned" && app.meetingId && app.meetingJoinUrl) {
    return { app, meeting: "reused" };
  }

  if ((await otherPaidCountForSlot(repo, app)) >= 1) {
    const updated = await repo.saveApplicationFulfillment(app.id, {
      meetingStatus: "slot_unavailable",
      applicationStatus: "PAID: CONSULTATION PENDING",
    });
    if (updated) {
      await repo.appendAudit("meeting_failed", "slot_unavailable", {
        applicationId: updated.applicationId,
        identityId: updated.identityId,
      });
    }
    return { app: updated || app, meeting: "slot_unavailable" };
  }

  try {
    const timezone = app.appointmentTimezone || app.meetingTimezone || "America/New_York";
    const startTime =
      app.preferredConsultationDate && app.appointmentTime
        ? `${app.preferredConsultationDate}T${app.appointmentTime}:00`
        : new Date().toISOString();
    const meeting = await zoom.createMeeting({
      topic: "DCredit Initial Assessment",
      startTime,
      durationMinutes: 30,
      timezone,
      idempotencyKey: app.applicationId,
    });
    const updated = await repo.saveApplicationFulfillment(app.id, {
      meetingProvider: meeting.provider,
      meetingId: meeting.meetingId,
      meetingJoinUrl: meeting.joinUrl,
      meetingStartsAt: meeting.startTime,
      meetingTimezone: meeting.timezone,
      meetingStatus: "provisioned",
      applicationStatus: "CONSULTATION BOOKED",
    });
    if (updated) {
      await repo.appendAudit("meeting_provisioned", meeting.meetingId, {
        applicationId: updated.applicationId,
        identityId: updated.identityId,
      });
      await repo.appendAudit("consultation_booked", "scheduled", {
        applicationId: updated.applicationId,
        identityId: updated.identityId,
      });
    }
    return { app: updated || app, meeting: "provisioned" };
  } catch (err) {
    const detail = err instanceof ZoomUnconfiguredError ? "unconfigured" : "provider";
    const updated = await repo.saveApplicationFulfillment(app.id, {
      meetingStatus: "failed",
      applicationStatus: "PAID: CONSULTATION PENDING",
    });
    if (updated) {
      await repo.appendAudit("meeting_failed", detail, {
        applicationId: updated.applicationId,
        identityId: updated.identityId,
      });
    }
    return { app: updated || app, meeting: "failed" };
  }
}

export async function fulfillPaidApplication(
  repo: ApplicationRepository,
  application: Application,
  deps: FulfillmentDeps = {}
): Promise<FulfillmentResult> {
  if (application.paymentStatus !== "PAID") {
    return { application, meeting: "skipped", notification: "skipped" };
  }

  const zoom = deps.zoom || createZoomClient();
  const notify = deps.notify || createEmailNotificationClient();

  let current = application;
  if (!current.meetingStatus) {
    const pending = await repo.saveApplicationFulfillment(current.id, { meetingStatus: "pending" });
    if (pending) current = pending;
  }

  const meetingResult = await provisionMeeting(repo, current, zoom);
  current = meetingResult.app;

  if (current.notificationStatus === "sent") {
    return { application: current, meeting: meetingResult.meeting, notification: "already_sent" };
  }

  try {
    const mail = await notifyConversationConfirmed(current, notify);
    if (mail.reason === "already_sent") {
      return { application: current, meeting: meetingResult.meeting, notification: "already_sent" };
    }
    const status = mail.sent ? "sent" : mail.reason === "email_unconfigured" ? "skipped" : "failed";
    const updated = await repo.saveApplicationFulfillment(current.id, { notificationStatus: status });
    if (updated) {
      await repo.appendAudit(mail.sent ? "email_sent" : "email_failed", mail.reason, {
        applicationId: updated.applicationId,
        identityId: updated.identityId,
      });
    }
    return {
      application: updated || current,
      meeting: meetingResult.meeting,
      notification: status === "sent" ? "sent" : status === "skipped" ? "skipped" : "failed",
    };
  } catch {
    const updated = await repo.saveApplicationFulfillment(current.id, { notificationStatus: "failed" });
    if (updated) {
      await repo.appendAudit("email_failed", "provider", {
        applicationId: updated.applicationId,
        identityId: updated.identityId,
      });
    }
    return { application: updated || current, meeting: meetingResult.meeting, notification: "failed" };
  }
}
