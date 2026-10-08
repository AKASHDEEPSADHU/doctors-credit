import type { PatientType } from "../assessment";

export type CheckoutInput = {
  origin: string; email: string; name: string; patientType: PatientType;
  orderId: string; currency: string; phone?: string;
};
export type PaymentAttempt = {
  paymentId: string;
  status: string;
  amountMinor: number;
  currency: string;
  captured: boolean;
  adjusted: boolean;
  occurredAt?: string;
};
export type ProviderOrder = {
  id: string; status: string; amountMinor: number; currency: string; sessionId: string;
};
export type AssessmentProvider = {
  name: "cashfree";
  environment: () => string;
  configured: () => boolean;
  internationalAllowed: () => boolean;
  create: (input: CheckoutInput) => Promise<{ id: string; url: string }>;
  getOrder: (id: string) => Promise<ProviderOrder>;
  getPayments: (id: string) => Promise<PaymentAttempt[]>;
  verifyWebhook: (body: string, timestamp: string, signature: string) => boolean;
};
