import { appEnv } from "./env";
import { ASSESSMENT_SERVICE, assessmentCheckoutAllowed, assessmentPrice, isPatientType } from "./assessment";
import { assessmentProvider } from "./payment-providers";
import { validBillingPhone } from "./payment-providers/cashfree";
import type { CheckoutInput } from "./payment-providers/types";
import { activeAssessment } from "./repo/assessments";
import type { ApplicationRepository } from "./repo/interface";
import type { Identity } from "./repo/types";

export type AssessmentCheckoutDeps = {
  environment: string;
  providerEnvironment: string;
  configured: (patient: Identity) => boolean;
  checkout: (input: CheckoutInput) => Promise<{ id: string; url: string } | null>;
  provider?: "cashfree" | "dodo";
  internationalAllowed?: () => boolean;
};
function defaults(): AssessmentCheckoutDeps {
  const provider = assessmentProvider();
  return {
    environment: appEnv(), providerEnvironment: provider.environment(), provider: provider.name,
    configured: provider.configured, checkout: provider.create, internationalAllowed: provider.internationalAllowed,
  };
}

export async function startAssessmentCheckout(
  repo: ApplicationRepository,
  patient: Identity | null,
  origin: string,
  fields: Record<string, unknown>,
  deps: AssessmentCheckoutDeps = defaults(),
) {
  if (!patient) throw new Error("Sign in with Google before checkout.");
  if (!isPatientType(patient.patientType)) throw new Error("Select and save your patient type first.");
  if (!assessmentCheckoutAllowed(deps.environment, deps.providerEnvironment)) {
    throw new Error("Live payment is disabled. Cancellation and refund policy approval is pending.");
  }
  if (fields.service !== ASSESSMENT_SERVICE) throw new Error("That service is not available.");
  if (fields.acknowledgeService !== "yes" || fields.acknowledgePrivacy !== "yes" || fields.acknowledgePendingPolicy !== "yes") {
    throw new Error("Please complete all acknowledgements before test checkout.");
  }
  if (deps.provider === "cashfree" && patient.patientType === "INTERNATIONAL" && !deps.internationalAllowed?.()) {
    throw new Error("USD 15 checkout is unavailable until Cashfree USD capability is confirmed. No INR conversion will be made.");
  }
  // Ignore client amount, currency, product ID and patient type. The saved
  // account classification is the sole pricing input.
  const existing = activeAssessment(await repo.assessments.list(patient.id));
  if (existing?.status === "PAID") return { order: existing, url: "/account" };
  if (existing?.status === "REVIEW_REQUIRED") throw new Error("This payment needs manual review. Do not pay again.");
  if (existing) {
    if (deps.provider === "cashfree" && existing.paymentProvider !== "cashfree") {
      throw new Error("A historical provider checkout is pending. Contact DCREDIT; do not pay again.");
    }
    if (existing.checkoutUrl) return { order: existing, url: existing.checkoutUrl };
    if (deps.provider !== "cashfree") throw new Error("A checkout is already pending. Do not pay again; contact DCredit if it does not resolve.");
  }
  if (!deps.configured(patient)) throw new Error("Cashfree sandbox checkout is not configured. No payment was taken.");
  const phone = String(fields.billingPhone || patient.phone || "").trim();
  if (deps.provider === "cashfree" && !validBillingPhone(phone)) throw new Error("Enter a valid billing phone number, including country code for international numbers.");
  let order = existing;
  try {
    order ||= await repo.assessments.create(patient.id, patient.patientType, deps.provider || "dodo");
  } catch {
    const active = activeAssessment(await repo.assessments.list(patient.id));
    if (active?.status === "PAID") return { order: active, url: "/account" };
    if (active?.status === "PENDING" && active.checkoutUrl) return { order: active, url: active.checkoutUrl };
    throw new Error("An assessment checkout is already pending. Do not pay again.");
  }
  const price = assessmentPrice(patient.patientType);
  // If a provider request times out, keep the order pending: the provider may
  // have created a session. Never automatically send a second charge attempt.
  let checkout;
  try {
    checkout = await deps.checkout({
      origin, email: patient.email, name: patient.name,
      patientType: patient.patientType, orderId: order.id, currency: price.currency, phone,
    });
  } catch {
    // Never put provider errors, request headers or credentials into a URL.
    throw new Error("Test checkout could not be confirmed. Do not pay again; contact DCredit for status.");
  }
  if (!checkout) throw new Error("Checkout could not be confirmed. Do not pay again; contact DCredit for status.");
  await repo.assessments.initiate(order.id, checkout.id, checkout.url);
  return { order, url: checkout.url };
}
