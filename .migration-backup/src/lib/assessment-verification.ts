import { assessmentCheckoutAllowed } from "./assessment";
import { appEnv } from "./env";
import { assessmentProvider } from "./payment-providers";
import { cashfreeOrderId, checkoutPath } from "./payment-providers/cashfree";
import type { AssessmentProvider } from "./payment-providers/types";
import type { ApplicationRepository } from "./repo/interface";

export async function verifyAssessmentPayment(
  repo: ApplicationRepository, id: string, provider: AssessmentProvider = assessmentProvider(), environment = appEnv(),
) {
  if (!assessmentCheckoutAllowed(environment, provider.environment())) throw new Error("Live payment verification is disabled.");
  const order = await repo.assessments.get(id);
  if (!order || order.paymentProvider !== provider.name || order.providerEnvironment !== "test_mode") throw new Error("Invalid assessment provider.");
  if (order.patientType === "INTERNATIONAL" && !provider.internationalAllowed()) throw new Error("USD capability is not verified.");
  const providerId = cashfreeOrderId(order.id);
  const snapshot = await provider.getOrder(providerId);
  if (snapshot.id !== providerId) throw new Error("Order reference mismatch.");
  // Recover provider references after a creation timeout/webhook race.
  if (!order.checkoutId) await repo.assessments.initiate(id, providerId, checkoutPath(id));
  if (order.checkoutId && order.checkoutId !== providerId) throw new Error("Order reference mismatch.");
  const attempts = await provider.getPayments(providerId);
  for (const attempt of attempts) await repo.assessments.recordAttempt(id, attempt);
  const successes = attempts.filter((attempt) => attempt.status === "SUCCESS" && attempt.captured);
  if (successes.length > 1) {
    await repo.assessments.review(id, "duplicate_successful_payment");
    return (await repo.assessments.get(id))!;
  }
  const success = successes[0];
  if (success) {
    if (success.adjusted || snapshot.amountMinor !== order.amountMinor || snapshot.currency !== order.currency) {
      await repo.assessments.review(id, "amount_currency_or_adjustment_mismatch");
      return (await repo.assessments.get(id))!;
    }
    if (snapshot.status !== "PAID") return (await repo.assessments.get(id))!; // provider status propagation
    if (order.paymentId && order.paymentId !== success.paymentId) {
      await repo.assessments.review(id, "duplicate_successful_payment");
      return (await repo.assessments.get(id))!;
    }
    return repo.assessments.confirm({
      id, checkoutId: providerId, paymentId: success.paymentId,
      amountMinor: success.amountMinor, currency: success.currency,
    });
  }
  // An attempt FAILED/USER_DROPPED does NOT terminate an ACTIVE Cashfree order.
  if (snapshot.status === "EXPIRED" || snapshot.status === "TERMINATED") {
    if (attempts.some((attempt) => attempt.status === "SUCCESS" || attempt.status === "PENDING")) {
      await repo.assessments.review(id, "terminal_order_with_unresolved_payment");
    } else await repo.assessments.fail(id);
  }
  return (await repo.assessments.get(id))!;
}
