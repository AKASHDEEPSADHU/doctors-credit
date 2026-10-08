export const ASSESSMENT_SERVICE = "initial_patient_assessment" as const;
export type PatientType = "DOMESTIC" | "INTERNATIONAL";

// Deliberately not controlled by an environment flag. Change only after the
// revised policy text has been supplied and approved by the product owner.
export const ASSESSMENT_POLICY_STATUS = "pending" as const;
export const ASSESSMENT_CONSENT_VERSION = "pending-policy-test-v1";

export function isPatientType(value: unknown): value is PatientType {
  return value === "DOMESTIC" || value === "INTERNATIONAL";
}

export function assessmentPrice(type: PatientType) {
  return type === "DOMESTIC"
    ? { amountMinor: 99900, currency: "INR" as const, label: "₹999 INR" }
    : { amountMinor: 1500, currency: "USD" as const, label: "USD 15" };
}

export function assessmentCheckoutAllowed(environment: string, providerEnvironment: string) {
  // Pending policy: never enable production or live-mode charges.
  return process.env.NODE_ENV !== "production"
    && environment !== "production" && providerEnvironment === "test_mode";
}

export function formatAssessmentAmount(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: currency.toUpperCase(),
  }).format(amountMinor / 100);
}
