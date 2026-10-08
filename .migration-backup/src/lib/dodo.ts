import DodoPayments from "dodopayments";
import type { Currency } from "dodopayments/resources/misc";
import { appEnv } from "@/lib/env";
import { ASSESSMENT_SERVICE, assessmentCheckoutAllowed, assessmentPrice, type PatientType } from "./assessment";

export const PAYMENT_PROVIDER = "dodo" as const;

export type DodoEnvironment = "test_mode" | "live_mode";

export function dodoEnvironment(): DodoEnvironment {
  const raw = (process.env.DODO_PAYMENTS_ENVIRONMENT || "").toLowerCase();
  if (raw === "live_mode" || raw === "test_mode") return raw;
  return appEnv() === "production" ? "live_mode" : "test_mode";
}

export function dodoApiKey() {
  return process.env.DODO_PAYMENTS_API_KEY || "";
}

export function dodoWebhookKey() {
  return process.env.DODO_PAYMENTS_WEBHOOK_KEY || "";
}

export function dodoOrientationProductId() {
  return process.env.DODO_PRODUCT_ID_ORIENTATION || "";
}

export function dodoReturnUrl(origin: string) {
  const configured = process.env.DODO_PAYMENTS_RETURN_URL || "";
  if (configured) return configured;
  return `${origin}/success`;
}

export function dodoPaymentsConfigured() {
  return Boolean(dodoApiKey() && dodoWebhookKey() && dodoOrientationProductId());
}

export function serverCheckoutMetadata(applicationId: string, sku: string) {
  return {
    application_id: applicationId,
    sku,
  };
}

export function buildCheckoutSessionRequest(opts: {
  origin: string;
  email: string;
  name: string;
  sku: string;
  applicationId: string;
  productId: string;
  billingCurrency?: string;
}) {
  return {
    product_cart: [{ product_id: opts.productId, quantity: 1 }],
    billing_currency: (opts.billingCurrency || "USD") as Currency,
    customer: {
      email: opts.email,
      name: opts.name,
    },
    return_url: dodoReturnUrl(opts.origin),
    cancel_url: `${opts.origin}/enroll?resume=1`,
    metadata: serverCheckoutMetadata(opts.applicationId, opts.sku),
    feature_flags: {
      redirect_immediately: true,
      allow_currency_selection: true,
    },
  };
}

export type CheckoutSessionClient = {
  checkoutSessions: {
    create: (body: Omit<ReturnType<typeof buildCheckoutSessionRequest>, "metadata"> & { metadata: Record<string, string> }) => Promise<{
      session_id: string;
      checkout_url?: string | null;
    }>;
  };
};

export function getDodoClient(): DodoPayments | null {
  const key = dodoApiKey();
  if (!key) return null;
  return new DodoPayments({
    bearerToken: key,
    environment: dodoEnvironment(),
  });
}

export async function createCheckout(
  opts: {
    origin: string;
    email: string;
    name: string;
    sku: string;
    applicationId: string;
    billingCurrency?: string;
  },
  client: CheckoutSessionClient | null = getDodoClient()
) {
  const productId = dodoOrientationProductId();
  if (!client || !productId) return null;
  const session = await client.checkoutSessions.create(
    buildCheckoutSessionRequest({
      ...opts,
      productId,
    })
  );
  if (!session.session_id || !session.checkout_url) return null;
  return { id: session.session_id, url: session.checkout_url };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export type PaymentEventRefs = {
  applicationId: string;
  providerPaymentId: string;
  providerCheckoutId: string;
};

export function paymentRefsFromPayload(payload: unknown): PaymentEventRefs {
  const root = asRecord(payload) || {};
  const data = asRecord(root.data) || root;
  const metadata = asRecord(data.metadata) || asRecord(root.metadata) || {};
  return {
    applicationId: asString(metadata.application_id) || asString(metadata.applicationId),
    providerPaymentId: asString(data.payment_id) || asString(data.paymentId) || asString(data.id),
    providerCheckoutId:
      asString(data.checkout_session_id) ||
      asString(data.checkout_id) ||
      asString(data.session_id),
  };
}

export function assessmentProductId(type: PatientType) {
  return type === "DOMESTIC"
    ? process.env.DODO_PRODUCT_ID_INITIAL_ASSESSMENT_INR || ""
    : process.env.DODO_PRODUCT_ID_INITIAL_ASSESSMENT_USD || "";
}

export function buildAssessmentCheckoutRequest(opts: {
  origin: string; email: string; name: string; patientType: PatientType;
  orderId: string; currency: string;
}) {
  const price = assessmentPrice(opts.patientType);
  return {
    ...buildCheckoutSessionRequest({
      ...opts, sku: ASSESSMENT_SERVICE, applicationId: "",
      productId: assessmentProductId(opts.patientType), billingCurrency: price.currency,
    }),
    metadata: { assessment_order_id: opts.orderId, service: ASSESSMENT_SERVICE, patient_type: opts.patientType },
    // Keep new assessment returns separate from historical $5 receipts.
    return_url: `${opts.origin}/success?assessment=1`,
    feature_flags: { redirect_immediately: true, allow_currency_selection: false, allow_discount_code: false },
  };
}

export async function createAssessmentCheckout(
  opts: Parameters<typeof buildAssessmentCheckoutRequest>[0],
  client: (CheckoutSessionClient & {
    products: { retrieve: (id: string) => Promise<{
      is_recurring: boolean;
      price: {
        type: string; currency?: string; price?: number; tax_inclusive?: boolean | null;
        discount?: number; discount_bps?: number | null;
        pay_what_you_want?: boolean; purchasing_power_parity?: boolean;
      };
    }> };
  }) | null = getDodoClient(),
) {
  if (!assessmentCheckoutAllowed(appEnv(), dodoEnvironment())) return null;
  if (!client || !assessmentProductId(opts.patientType)) return null;
  // Check the remote product too: a stale/misconfigured provider product must
  // never silently replace the fixed server price at hosted checkout.
  const product = await client.products.retrieve(assessmentProductId(opts.patientType));
  const expected = assessmentPrice(opts.patientType);
  const price = product.price;
  if (product.is_recurring || price.type !== "one_time_price"
    || price.price !== expected.amountMinor || price.currency !== expected.currency
    || price.tax_inclusive !== true || price.pay_what_you_want
    || price.purchasing_power_parity || (price.discount_bps ?? price.discount ?? 0) !== 0) {
    throw new Error("Assessment product configuration does not match the fixed assessment fee.");
  }
  const session = await client.checkoutSessions.create(buildAssessmentCheckoutRequest(opts));
  if (!session.session_id || !session.checkout_url) return null;
  const url = new URL(session.checkout_url);
  if (url.protocol !== "https:") throw new Error("Invalid checkout URL.");
  return { id: session.session_id, url: url.toString() };
}

export function assessmentEventDetails(payload: unknown) {
  const root = asRecord(payload) || {};
  const data = asRecord(root.data) || {};
  const metadata = asRecord(data.metadata) || {};
  return {
    orderId: asString(metadata.assessment_order_id),
    checkoutId: asString(data.checkout_session_id),
    paymentId: asString(data.payment_id),
    amountMinor: typeof data.total_amount === "number" && Number.isSafeInteger(data.total_amount) ? data.total_amount : null,
    currency: asString(data.currency).toUpperCase(),
  };
}
