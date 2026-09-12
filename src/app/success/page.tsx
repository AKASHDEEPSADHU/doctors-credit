import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import { setSession } from "@/lib/session";
import { packageBySku } from "@/lib/packages";
import {
  createOrder,
  getOrderByStripeSession,
  getPatientById,
  markOrderPaid,
  upsertPatient,
} from "@/lib/store";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const stripe = getStripe();
  if (!sessionId || !stripe) redirect("/account");

  const checkout = await stripe.checkout.sessions.retrieve(sessionId);
  if (checkout.payment_status !== "paid" && checkout.status !== "complete") {
    redirect("/#enroll");
  }

  const meta = checkout.metadata || {};
  let order = getOrderByStripeSession(sessionId);
  if (order) {
    markOrderPaid(order.id, String(checkout.payment_intent || ""));
  } else if (meta.orderId) {
    markOrderPaid(meta.orderId, String(checkout.payment_intent || ""));
  }

  const email = checkout.customer_email || checkout.customer_details?.email || "";
  if (email) {
    const patient = upsertPatient({
      email,
      name: checkout.customer_details?.name || "Patient",
      phone: checkout.customer_details?.phone || "",
      country: "",
      stripeCustomerId:
        typeof checkout.customer === "string" ? checkout.customer : undefined,
    });
    if (!order && !meta.orderId) {
      const pkg = packageBySku(meta.sku || "orientation");
      if (pkg) {
        const created = createOrder({
          patientId: patient.id,
          sku: pkg.sku,
          title: pkg.name,
          amountCents: checkout.amount_total || pkg.amountCents,
          currency: (checkout.currency || "usd").toLowerCase(),
          status: "pending",
          stripeSessionId: sessionId,
        });
        markOrderPaid(created.id, String(checkout.payment_intent || ""));
      }
    }
    await setSession({ patientId: patient.id, email: patient.email });
  } else if (meta.patientId) {
    const patient = getPatientById(meta.patientId);
    if (patient) await setSession({ patientId: patient.id, email: patient.email });
  }

  redirect("/account?welcome=1");
}
