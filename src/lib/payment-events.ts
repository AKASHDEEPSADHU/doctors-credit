import { PAYMENT_PROVIDER, paymentRefsFromPayload, type PaymentEventRefs } from "@/lib/dodo";
import type { ApplicationRepository } from "@/lib/repo/interface";
import type { Application } from "@/lib/repo/types";

export type PaymentApplyResult = {
  status: "paid" | "already_paid" | "not_found" | "failed" | "ignored";
  application: Application | null;
};

async function findApplication(repo: ApplicationRepository, refs: PaymentEventRefs) {
  // A present application_id is authoritative. Unknown/malformed IDs must not
  // attach the payment to a different application via checkout/payment fallback.
  if (refs.applicationId) {
    return repo.getApplicationByPublicId(refs.applicationId);
  }
  if (refs.providerCheckoutId) {
    const byCheckout = await repo.getApplicationByProviderCheckout(refs.providerCheckoutId);
    if (byCheckout) return byCheckout;
  }
  if (refs.providerPaymentId) {
    const byPayment = await repo.getApplicationByProviderPayment(refs.providerPaymentId);
    if (byPayment) return byPayment;
  }
  return null;
}

export async function applyPaymentSucceeded(
  repo: ApplicationRepository,
  payload: unknown
): Promise<PaymentApplyResult> {
  const refs = paymentRefsFromPayload(payload);
  const existing = await findApplication(repo, refs);
  if (!existing) return { status: "not_found", application: null };

  const alreadyPaid = existing.paymentStatus === "PAID";
  const paid = await repo.confirmPayment({
    id: existing.id,
    paymentProvider: PAYMENT_PROVIDER,
    providerCheckoutId: refs.providerCheckoutId || existing.providerCheckoutId,
    providerPaymentId: refs.providerPaymentId || existing.providerPaymentId,
    paymentReference: refs.providerPaymentId || existing.paymentReference || existing.applicationId,
  });
  if (!paid || paid.paymentStatus !== "PAID") {
    return { status: "not_found", application: null };
  }
  return { status: alreadyPaid ? "already_paid" : "paid", application: paid };
}

export async function applyPaymentFailed(
  repo: ApplicationRepository,
  payload: unknown
): Promise<PaymentApplyResult> {
  const refs = paymentRefsFromPayload(payload);
  const existing = await findApplication(repo, refs);
  if (!existing) return { status: "not_found", application: null };
  if (existing.paymentStatus === "PAID") {
    return { status: "ignored", application: existing };
  }
  const failed = await repo.markPaymentFailed(existing.id, refs.providerPaymentId || refs.providerCheckoutId);
  return { status: "failed", application: failed };
}
