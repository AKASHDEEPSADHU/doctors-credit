import { Webhooks } from "@dodopayments/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { sendApplicationConfirmationOnce } from "@/lib/email";
import { dodoWebhookKey } from "@/lib/dodo";
import { applyPaymentFailed, applyPaymentSucceeded } from "@/lib/payment-events";
import { tooLarge } from "@/lib/rate-limit";
import { getRepository } from "@/lib/repo";
import type { ApplicationRepository } from "@/lib/repo/interface";

type WebhookDeps = {
  getRepository: () => Promise<ApplicationRepository>;
  webhookKey: () => string;
};

const defaultDeps: WebhookDeps = {
  getRepository,
  webhookKey: dodoWebhookKey,
};

async function confirmAndNotify(repo: ApplicationRepository, payload: unknown) {
  const result = await applyPaymentSucceeded(repo, payload);
  if (result.status === "not_found" || !result.application) {
    throw new Error("Application not found.");
  }
  const paid = result.application;
  try {
    const mail = await sendApplicationConfirmationOnce(paid, result.status === "already_paid");
    if (mail.reason !== "already_confirmed") {
      await repo.appendAudit(mail.sent ? "email_sent" : "email_failed", mail.sent ? "sent" : mail.reason, {
        applicationId: paid.applicationId,
        identityId: paid.identityId,
      });
    }
  } catch {
    await repo.appendAudit("email_failed", "provider", {
      applicationId: paid.applicationId,
      identityId: paid.identityId,
    });
  }
  await repo.retryPendingSheetsSync();
}

export function createDodoWebhookPost(deps: WebhookDeps = defaultDeps) {
  return async function POST(req: NextRequest) {
    if (tooLarge(req, 256_000)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 413 });
    }
    const webhookKey = deps.webhookKey();
    if (!webhookKey) {
      return NextResponse.json({ error: "Payment confirmation is not configured." }, { status: 503 });
    }
    const handle = Webhooks({
      webhookKey,
      onPaymentSucceeded: async (payload) => {
        const repo = await deps.getRepository();
        await confirmAndNotify(repo, payload);
      },
      onPaymentFailed: async (payload) => {
        const repo = await deps.getRepository();
        await applyPaymentFailed(repo, payload);
      },
    });
    return handle(req);
  };
}

export const POST = createDodoWebhookPost();
