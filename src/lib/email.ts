import { SITE } from "@/lib/contact";
import type { Application } from "@/lib/repo/types";

function confirmationBody(app: Application) {
  return [
    "Your DCredit application has been received.",
    "",
    `Application ID: ${app.applicationId}`,
    `Conversation Verification ID: ${app.conversationVerificationId}`,
    "",
    "Keep these details available when communicating with DCredit. We may ask for your Conversation Verification ID to verify your case.",
    "",
    "DCredit will never ask for your password, banking PIN, card CVV or one-time authentication code.",
    "",
    `If you did not submit this application, email ${SITE.email}.`,
  ].join("\n");
}

export async function sendApplicationConfirmationOnce(
  app: Application,
  alreadyPaid: boolean
) {
  if (alreadyPaid) return { sent: false as const, reason: "already_confirmed" as const };
  return sendApplicationConfirmation(app);
}

export async function sendApplicationConfirmation(app: Application) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.TRANSACTIONAL_FROM_EMAIL || `DCredit <noreply@${SITE.domain}>`;
  if (!key) {
    return { sent: false, reason: "email_unconfigured" as const };
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
      subject: `DCredit application ${app.applicationId} received`,
      text: confirmationBody(app),
    }),
  });
  if (!res.ok) {
    throw new Error(`Email provider ${res.status}`);
  }
  return { sent: true as const };
}
