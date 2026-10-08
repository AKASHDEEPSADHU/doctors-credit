import { createHmac, timingSafeEqual } from "node:crypto";
import { assessmentCheckoutAllowed, assessmentPrice } from "../assessment";
import { appEnv } from "../env";
import type { AssessmentProvider, CheckoutInput, PaymentAttempt, ProviderOrder } from "./types";

export const CASHFREE_SANDBOX_API = "https://sandbox.cashfree.com/pg";
export const CASHFREE_WEBHOOK_VERSION = "2026-01-01";

// Preserve large numeric payment IDs before ordinary JSON number conversion
// can lose precision. Older runtimes without JSON source context fail closed.
export function parseCashfreeResponse(raw: string): unknown {
  return JSON.parse(raw, (key: string, value: unknown, context?: { source?: string }) => {
    if (key !== "cf_payment_id" || typeof value !== "number") return value;
    if (context?.source && /^\d+$/.test(context.source)) return context.source;
    if (Number.isSafeInteger(value) && value >= 0) return String(value);
    throw new Error("Cashfree payment reference cannot be represented safely.");
  });
}
export const cashfreeOrderId = (id: string) => `ipa_${id}`;
export const checkoutPath = (id: string) => `/assessment/checkout?order=${encodeURIComponent(id)}`;

export function moneyMinor(value: unknown): number {
  if (typeof value !== "number" && typeof value !== "string") throw new Error("Missing payment amount.");
  const text = String(value);
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) throw new Error("Invalid payment amount.");
  const [whole, decimals = ""] = text.split(".");
  const minor = Number(whole) * 100 + Number(decimals.padEnd(2, "0"));
  if (!Number.isSafeInteger(minor)) throw new Error("Invalid payment amount.");
  return minor;
}
function reference(value: unknown) {
  if (typeof value === "number" && !Number.isSafeInteger(value)) throw new Error("Unsafe payment reference.");
  if ((typeof value !== "string" && typeof value !== "number") || !String(value)) throw new Error("Missing payment reference.");
  return String(value);
}
export function validBillingPhone(phone: unknown): phone is string {
  return typeof phone === "string" && /^\+?[1-9]\d{7,14}$/.test(phone);
}
export function cashfreeEnvironment() {
  return process.env.CASHFREE_ENVIRONMENT === "sandbox" ? "test_mode" : "disabled";
}
export function cashfreeUsdAllowed() {
  return process.env.CASHFREE_USD_SANDBOX_VERIFIED === "true";
}
export function cashfreeConfigured() {
  return cashfreeEnvironment() === "test_mode"
    && Boolean(process.env.CASHFREE_CLIENT_ID && process.env.CASHFREE_CLIENT_SECRET && process.env.CASHFREE_PUBLIC_ORIGIN)
    && (process.env.CASHFREE_API_VERSION || CASHFREE_WEBHOOK_VERSION) === CASHFREE_WEBHOOK_VERSION;
}
export function verifyCashfreeSignature(body: string, timestamp: string, signature: string, secret = process.env.CASHFREE_CLIENT_SECRET || "") {
  if (!secret || !/^\d{10,16}$/.test(timestamp) || !/^[A-Za-z0-9+/]{43}=$/.test(signature)) return false;
  const actual = Buffer.from(signature, "base64");
  const expected = createHmac("sha256", secret).update(timestamp + body).digest();
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
function sandboxAllowed() {
  if (!assessmentCheckoutAllowed(appEnv(), cashfreeEnvironment())) throw new Error("Live assessment payments are disabled.");
  if (!cashfreeConfigured()) throw new Error("Cashfree sandbox is not configured.");
}
export function callbackOrigin(origin: string) {
  const configured = process.env.CASHFREE_PUBLIC_ORIGIN;
  if (!configured) throw new Error("Cashfree callback origin is not configured.");
  const url = new URL(configured);
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash || url.pathname !== "/") {
    throw new Error("Cashfree requires a public HTTPS origin.");
  }
  if (url.origin !== origin) throw new Error("Checkout origin does not match configuration.");
  return url.origin;
}
export function normalizeCashfreeOrder(raw: unknown): ProviderOrder {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Invalid Cashfree order response.");
  const data = raw as Record<string, unknown>;
  return {
    id: reference(data.order_id), status: String(data.order_status || ""),
    amountMinor: moneyMinor(data.order_amount), currency: String(data.order_currency || ""),
    sessionId: typeof data.payment_session_id === "string" ? data.payment_session_id : "",
  };
}
export function normalizeCashfreePayment(raw: unknown, orderId: string): PaymentAttempt {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Invalid Cashfree payment response.");
  const data = raw as Record<string, unknown>;
  if (data.order_id !== orderId) throw new Error("Payment belongs to another order.");
  const surcharge = data.payment_surcharge as Record<string, unknown> | undefined;
  return {
    paymentId: reference(data.cf_payment_id), status: String(data.payment_status || ""),
    amountMinor: moneyMinor(data.payment_amount), currency: String(data.payment_currency || ""),
    captured: data.is_captured === true,
    occurredAt: typeof data.payment_time === "string" && Number.isFinite(Date.parse(data.payment_time))
      ? new Date(data.payment_time).toISOString() : undefined,
    adjusted: Boolean((data.payment_offers && (!Array.isArray(data.payment_offers) || data.payment_offers.length))
      || (surcharge && (moneyMinor(surcharge.payment_surcharge_service_charge ?? 0) > 0
        || moneyMinor(surcharge.payment_surcharge_service_tax ?? 0) > 0))),
  };
}

// Native fetch keeps the adapter compatible with the imported Next/OpenNext
// architecture. No connector or server SDK is needed.
export function createCashfreeProvider(fetcher: typeof fetch = fetch): AssessmentProvider {
  async function request(path: string, init: RequestInit = {}, idempotency?: string) {
    sandboxAllowed();
    const response = await fetcher(`${CASHFREE_SANDBOX_API}${path}`, {
      ...init, cache: "no-store", signal: AbortSignal.timeout(15000),
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID!,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
        "x-api-version": CASHFREE_WEBHOOK_VERSION,
        ...(idempotency ? { "x-idempotency-key": idempotency } : {}),
      },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Cashfree sandbox request could not be verified.");
    return parseCashfreeResponse(await response.text());
  }
  async function getOrder(id: string) {
    const data = await request(`/orders/${encodeURIComponent(id)}`);
    if (!data) throw new Error("Cashfree order not found.");
    return normalizeCashfreeOrder(data);
  }
  return {
    name: "cashfree", environment: cashfreeEnvironment, configured: cashfreeConfigured,
    internationalAllowed: cashfreeUsdAllowed, verifyWebhook: verifyCashfreeSignature, getOrder,
    async getPayments(id) {
      const data = await request(`/orders/${encodeURIComponent(id)}/payments`);
      if (!Array.isArray(data)) throw new Error("Payment verification is unavailable.");
      return data.map((payment) => normalizeCashfreePayment(payment, id))
        .sort((a, b) => (a.occurredAt || "").localeCompare(b.occurredAt || ""));
    },
    async create(input: CheckoutInput) {
      sandboxAllowed();
      if (input.patientType === "INTERNATIONAL" && !cashfreeUsdAllowed()) throw new Error("USD capability is not verified.");
      if (!validBillingPhone(input.phone)) throw new Error("A valid billing phone is required.");
      const origin = callbackOrigin(input.origin);
      const price = assessmentPrice(input.patientType);
      const id = cashfreeOrderId(input.orderId);
      // Reconcile a timed-out creation before retrying the same idempotent order.
      let data = await request(`/orders/${encodeURIComponent(id)}`);
      if (!data) data = await request("/orders", {
        method: "POST",
        body: JSON.stringify({
          order_id: id, order_amount: price.amountMinor / 100, order_currency: price.currency,
          customer_details: {
            customer_id: input.orderId, customer_email: input.email,
            customer_name: input.name, customer_phone: input.phone,
          },
          order_meta: { return_url: `${origin}/success?assessment=1&order_id=${encodeURIComponent(id)}` },
          // Intentionally NO notify_url: never invoke/reuse the merchant's
          // existing NOTIFY_URL / 2023-08-01 webhook configuration.
          order_note: "Initial Patient Assessment — coordination and assistance fee",
        }),
      }, input.orderId);
      if (!data) throw new Error("Cashfree order could not be created.");
      const order = normalizeCashfreeOrder(data);
      if (order.id !== id || order.amountMinor !== price.amountMinor || order.currency !== price.currency) {
        throw new Error("Cashfree order amount or currency mismatch.");
      }
      return { id, url: checkoutPath(input.orderId) };
    },
  };
}
