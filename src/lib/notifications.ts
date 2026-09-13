import { formatAppointmentDate, formatTimeLabel, scheduleTimezoneLabel } from "@/lib/appointment-slots";
import { SITE } from "@/lib/contact";
import type { Application } from "@/lib/repo/types";

export type NotificationResult = {
  sent: boolean;
  reason: "sent" | "already_sent" | "email_unconfigured" | "provider" | "not_paid";
};

export type NotificationClient = {
  sendConversationConfirmed(app: Application): Promise<NotificationResult>;
};

export function conversationConfirmationText(app: Application) {
  const date = app.preferredConsultationDate ? formatAppointmentDate(app.preferredConsultationDate) : "";
  const time = app.appointmentTime ? formatTimeLabel(app.appointmentTime) : "";
  const zone = app.appointmentTimezone ? scheduleTimezoneLabel() : "";
  const lines = [
    "Your care conversation has been confirmed.",
    "",
  ];
  if (date && time) {
    lines.push("Your conversation is scheduled for:");
    lines.push(date);
    lines.push(`${time} ${zone}`.trim());
    lines.push("");
  }
  if (app.meetingJoinUrl && app.meetingStatus === "provisioned") {
    lines.push("Join your DCredit conversation:");
    lines.push(app.meetingJoinUrl);
    lines.push("");
    lines.push("Please join a few minutes before your scheduled time.");
    lines.push("");
  } else {
    lines.push("We're finalizing your conversation details. Your appointment information will appear in your DCredit account once confirmed.");
    lines.push("");
  }
  lines.push(
    "This conversation is with a DCredit care coordinator. It is not a medical diagnosis or clinical evaluation."
  );
  lines.push("");
  lines.push(`Application ID: ${app.applicationId}`);
  lines.push(`Conversation Verification ID: ${app.conversationVerificationId}`);
  lines.push("");
  lines.push("DCredit does not handle medical emergencies. If you are experiencing an emergency, call 911 or seek immediate local emergency care.");
  lines.push("");
  lines.push("DCredit will never ask for your password, banking PIN, card CVV or one-time authentication code.");
  lines.push("");
  lines.push(`If you did not submit this application, email ${SITE.email}.`);
  return lines.join("\n");
}

export function createEmailNotificationClient(): NotificationClient {
  return {
    async sendConversationConfirmed(app) {
      if (app.paymentStatus !== "PAID") {
        return { sent: false, reason: "not_paid" };
      }
      const key = process.env.RESEND_API_KEY;
      const from = process.env.TRANSACTIONAL_FROM_EMAIL || `DCredit <noreply@${SITE.domain}>`;
      if (!key) {
        return { sent: false, reason: "email_unconfigured" };
      }
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [app.email],
          subject: "Your Doctor's Credit conversation is confirmed",
          text: conversationConfirmationText(app),
        }),
      });
      if (!res.ok) {
        throw new Error(`Email provider ${res.status}`);
      }
      return { sent: true, reason: "sent" };
    },
  };
}

export async function notifyConversationConfirmed(
  app: Application,
  client: NotificationClient = createEmailNotificationClient()
): Promise<NotificationResult> {
  if (app.notificationStatus === "sent") {
    return { sent: false, reason: "already_sent" };
  }
  return client.sendConversationConfirmed(app);
}
