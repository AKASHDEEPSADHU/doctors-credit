import { purchasablePackage } from "@/lib/packages";

export type CheckoutSessionLike = { patientId: string; email: string } | null;

export function evaluateCheckoutAccess(session: CheckoutSessionLike) {
  if (!session) return { ok: false as const, reason: "unauthenticated" as const };
  return { ok: true as const };
}

/**
 * Server-controlled V1 product. Client sku/amount/product IDs cannot change
 * what is sold.
 */
export function resolveCheckoutProduct(input: {
  sku?: string;
  amountCents?: number;
  productId?: string;
}) {
  const pkg = purchasablePackage(input.sku || "orientation");
  if (!pkg) return { ok: false as const, reason: "sku_unavailable" as const };
  return {
    ok: true as const,
    sku: pkg.sku,
    amountCents: pkg.amountCents,
    title: pkg.name,
  };
}
