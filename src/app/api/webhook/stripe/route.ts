import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  getOrderByStripeSession,
  markOrderPaid,
  createOrder,
  upsertPatient,
} from "@/lib/store";
import { packageBySku } from "@/lib/packages";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ received: true, skipped: true });
  }
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;
    const existing = getOrderByStripeSession(sessionId);
    const meta = session.metadata || {};
    if (existing) {
      markOrderPaid(existing.id, String(session.payment_intent || ""));
    } else if (meta.orderId) {
      markOrderPaid(meta.orderId, String(session.payment_intent || ""));
    } else {
      const email = session.customer_email || session.customer_details?.email;
      const sku = meta.sku || "orientation";
      const pkg = packageBySku(sku);
      if (email && pkg) {
        const patient = upsertPatient({
          email,
          name: session.customer_details?.name || "Patient",
          phone: session.customer_details?.phone || "",
          country: "",
        });
        const order = createOrder({
          patientId: patient.id,
          sku: pkg.sku,
          title: pkg.name,
          amountCents: session.amount_total || pkg.amountCents,
          currency: (session.currency || "usd").toLowerCase(),
          status: "pending",
          stripeSessionId: sessionId,
        });
        markOrderPaid(order.id, String(session.payment_intent || ""));
      }
    }
  }
  return NextResponse.json({ received: true });
}
