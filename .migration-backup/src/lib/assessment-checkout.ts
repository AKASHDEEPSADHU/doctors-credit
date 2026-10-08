import { appEnv } from "./env";
import { ASSESSMENT_SERVICE, assessmentCheckoutAllowed, assessmentPrice, isPatientType } from "./assessment";
import { createAssessmentCheckout, dodoEnvironment, dodoApiKey, dodoWebhookKey, assessmentProductId } from "./dodo";
import { activeAssessment } from "./repo/assessments";
import type { ApplicationRepository } from "./repo/interface";
import type { Identity } from "./repo/types";

export type AssessmentCheckoutDeps = {
  environment: string;
  providerEnvironment: string;
  configured: (patient: Identity) => boolean;
  checkout: typeof createAssessmentCheckout;
};
const defaults: AssessmentCheckoutDeps = {
  environment: appEnv(), providerEnvironment: dodoEnvironment(),
  configured: (patient) => Boolean(dodoApiKey() && dodoWebhookKey() && patient.patientType && assessmentProductId(patient.patientType)),
  checkout: createAssessmentCheckout,
};

export async function startAssessmentCheckout(
  repo: ApplicationRepository,
  patient: Identity | null,
  origin: string,
  fields: Record<string, unknown>,
  deps: AssessmentCheckoutDeps = defaults,
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
  // Ignore client amount, currency, product ID and patient type. The saved
  // account classification is the sole pricing input.
  const existing = activeAssessment(await repo.assessments.list(patient.id));
  if (existing?.status === "PAID") return { order: existing, url: "/account" };
  if (existing?.status === "REVIEW_REQUIRED") throw new Error("This payment needs manual review. Do not pay again.");
  if (existing) {
    if (existing.checkoutUrl) return { order: existing, url: existing.checkoutUrl };
    throw new Error("A checkout is already pending. Do not pay again; contact DCredit if it does not resolve.");
  }
  if (!deps.configured(patient)) throw new Error("Dodo test checkout is not configured. No payment was taken.");
  let order;
  try {
    order = await repo.assessments.create(patient.id, patient.patientType);
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
      patientType: patient.patientType, orderId: order.id, currency: price.currency,
    });
  } catch {
    // Never put provider errors, request headers or credentials into a URL.
    throw new Error("Test checkout could not be confirmed. Do not pay again; contact DCredit for status.");
  }
  if (!checkout) throw new Error("Checkout could not be confirmed. Do not pay again; contact DCredit for status.");
  await repo.assessments.initiate(order.id, checkout.id, checkout.url);
  return { order, url: checkout.url };
}
