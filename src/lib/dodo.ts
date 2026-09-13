import DodoPayments from "dodopayments";
import { appEnv } from "@/lib/env";

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
}) {
  return {
    product_cart: [{ product_id: opts.productId, quantity: 1 }],
    customer: {
      email: opts.email,
      name: opts.name,
    },
    return_url: dodoReturnUrl(opts.origin),
    cancel_url: `${opts.origin}/enroll?resume=1`,
    metadata: serverCheckoutMetadata(opts.applicationId, opts.sku),
    feature_flags: {
      redirect_immediately: true,
    },
  };
}

export type CheckoutSessionClient = {
  checkoutSessions: {
    create: (body: ReturnType<typeof buildCheckoutSessionRequest>) => Promise<{
      session_id: string;
      checkout_url?: string | null;
    }>;
  };
};

export function getDodoClient(): CheckoutSessionClient | null {
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
