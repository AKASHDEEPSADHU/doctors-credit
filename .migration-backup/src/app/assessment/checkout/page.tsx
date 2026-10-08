import { redirect } from "next/navigation";
import CashfreeCheckout from "@/components/CashfreeCheckout";
import { assessmentCheckoutAllowed, formatAssessmentAmount } from "@/lib/assessment";
import { appEnv } from "@/lib/env";
import { assessmentProvider } from "@/lib/payment-providers";
import { cashfreeOrderId, cashfreeUsdAllowed } from "@/lib/payment-providers/cashfree";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";

export const metadata = { title: "Sandbox assessment checkout | DCREDIT" };
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: id } = await searchParams;
  const session = await getSession();
  if (!session) redirect(`/signin?next=${encodeURIComponent(`/assessment/checkout?order=${id || ""}`)}`);
  const repo = await getRepository();
  const order = id ? await repo.assessments.get(id) : null;
  if (!order || order.identityId !== session.patientId || order.paymentProvider !== "cashfree") return <main className="legal"><h1>Checkout unavailable</h1><a href="/account">My Account</a></main>;
  if (order.status !== "PENDING" || order.reviewReason) redirect("/account");
  const provider = assessmentProvider();
  let sessionId = "";
  if (assessmentCheckoutAllowed(appEnv(), provider.environment()) && (order.patientType !== "INTERNATIONAL" || cashfreeUsdAllowed())) {
    try {
      const snapshot = await provider.getOrder(cashfreeOrderId(order.id));
      if (snapshot.id === order.checkoutId && snapshot.amountMinor === order.amountMinor && snapshot.currency === order.currency
        && snapshot.status === "ACTIVE") sessionId = snapshot.sessionId;
    } catch { /* Render an explicit unavailable state, never a payment fallback. */ }
  }
  // Ownership is always rechecked on the return page. The query identifies an
  // order but never confirms payment, and works across signed-in browsers.
  const statusUrl = `/success?assessment=1&order_id=${encodeURIComponent(cashfreeOrderId(order.id))}`;
  return <main className="legal">
    <h1>Cashfree sandbox checkout</h1>
    <p>{formatAssessmentAmount(order.amountMinor, order.currency)} · One-time coordination and assistance fee.</p>
    <p>Test payments only. Live payments are disabled and cancellation/refund terms remain pending.</p>
    {sessionId ? <CashfreeCheckout sessionId={sessionId} statusUrl={statusUrl} /> : <p role="alert">This checkout is unavailable or needs server verification. Do not create a second payment. <a href={statusUrl}>Check payment status</a></p>}
    <a href="/enroll">Return to assessment</a>
  </main>;
}
