import { CASHFREE_WEBHOOK_VERSION } from "./payment-providers/cashfree";
import type { AssessmentProvider } from "./payment-providers/types";
import type { ApplicationRepository } from "./repo/interface";
import { verifyAssessmentPayment } from "./assessment-verification";

export async function processCashfreeWebhook(
  repo: ApplicationRepository, provider: AssessmentProvider, body: string,
  timestamp: string, signature: string, version: string,
) {
  if (version !== CASHFREE_WEBHOOK_VERSION) throw new Error("Unsupported Cashfree webhook version.");
  if (!provider.verifyWebhook(body, timestamp, signature)) throw new Error("Invalid webhook signature.");
  const event = JSON.parse(body);
  if (!["PAYMENT_SUCCESS_WEBHOOK", "PAYMENT_FAILED_WEBHOOK", "PAYMENT_USER_DROPPED_WEBHOOK"].includes(event.type)) return;
  const providerId = event.data?.order?.order_id;
  if (typeof providerId !== "string" || !/^ipa_[a-f0-9-]{36}$/.test(providerId)) return; // another merchant application
  const order = await repo.assessments.get(providerId.slice(4));
  if (!order || order.paymentProvider !== "cashfree") throw new Error("Unknown Cashfree assessment.");
  // Never trust amount/status in a callback in isolation; cross-check Cashfree.
  await verifyAssessmentPayment(repo, order.id, provider);
}
