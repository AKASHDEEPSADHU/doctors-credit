import { notifyConversationConfirmed } from "@/lib/notifications";
import type { Application } from "@/lib/repo/types";

export async function sendApplicationConfirmationOnce(app: Application, alreadyNotified: boolean) {
  if (alreadyNotified || app.notificationStatus === "sent") {
    return { sent: false as const, reason: "already_confirmed" as const };
  }
  return notifyConversationConfirmed(app);
}

export async function sendApplicationConfirmation(app: Application) {
  return notifyConversationConfirmed(app);
}
