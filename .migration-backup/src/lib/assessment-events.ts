import { assessmentCheckoutAllowed } from "./assessment";
import { assessmentEventDetails, dodoEnvironment } from "./dodo";
import { appEnv } from "./env";
import type { ApplicationRepository } from "./repo/interface";

// Called only by the signature-verifying Dodo webhook handler.
export async function applyAssessmentEvent(
  repo: ApplicationRepository, payload: unknown, succeeded: boolean,
  environment = appEnv(), providerEnvironment = dodoEnvironment(),
) {
  const details = assessmentEventDetails(payload);
  const order = details.orderId
    ? await repo.assessments.get(details.orderId)
    : details.checkoutId ? await repo.assessments.byCheckout(details.checkoutId) : null;
  if (!order) {
    if (details.orderId) throw new Error("Unknown assessment order.");
    return false; // Historical conversation webhook, handled by the legacy path.
  }
  if (order.paymentProvider === "cashfree") throw new Error("Dodo cannot process a Cashfree assessment.");
  if (!assessmentCheckoutAllowed(environment, providerEnvironment)) {
    throw new Error("Assessment payment activation is disabled pending policy approval.");
  }
  if (!succeeded) {
    if (details.checkoutId && details.checkoutId !== order.checkoutId) throw new Error("Checkout does not match order.");
    await repo.assessments.fail(order.id);
    return true;
  }
  if (!details.paymentId || details.amountMinor === null || details.amountMinor < 0 || !details.currency) {
    throw new Error("Confirmed payment details are incomplete.");
  }
  await repo.assessments.confirm({
    id: order.id, checkoutId: details.checkoutId || order.checkoutId || "",
    paymentId: details.paymentId, amountMinor: details.amountMinor, currency: details.currency,
  });
  return true;
}
