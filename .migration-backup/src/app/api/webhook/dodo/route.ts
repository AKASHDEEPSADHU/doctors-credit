import { Webhooks } from "@dodopayments/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { dodoWebhookKey } from "@/lib/dodo";
import { fulfillPaidApplication, type FulfillmentDeps } from "@/lib/fulfillment";
import { applyPaymentFailed, applyPaymentSucceeded } from "@/lib/payment-events";
import { tooLarge } from "@/lib/rate-limit";
import { getRepository } from "@/lib/repo";
import type { ApplicationRepository } from "@/lib/repo/interface";

type WebhookDeps = {
  getRepository: () => Promise<ApplicationRepository>;
  webhookKey: () => string;
  fulfill?: typeof fulfillPaidApplication;
  fulfillment?: FulfillmentDeps;
};

const defaultDeps: WebhookDeps = {
  getRepository,
  webhookKey: dodoWebhookKey,
};

async function confirmAndFulfill(repo: ApplicationRepository, payload: unknown, deps: WebhookDeps) {
  const result = await applyPaymentSucceeded(repo, payload);
  if (result.status === "not_found" || !result.application) {
    throw new Error("Application not found.");
  }
  const fulfill = deps.fulfill || fulfillPaidApplication;
  try {
    await fulfill(repo, result.application, deps.fulfillment);
  } catch {
    await repo.appendAudit("meeting_failed", "fulfillment", {
      applicationId: result.application.applicationId,
      identityId: result.application.identityId,
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
        await confirmAndFulfill(repo, payload, deps);
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
