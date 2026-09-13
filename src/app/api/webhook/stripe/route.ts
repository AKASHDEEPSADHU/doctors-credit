import { NextRequest, NextResponse } from "next/server";
import { sendApplicationConfirmation } from "@/lib/email";
import { getRepository } from "@/lib/repo";
import { getStripe } from "@/lib/stripe";

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
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ received: true, ignored: "unpaid" });
  }

  const repo = await getRepository();
  const meta = session.metadata || {};
  const existing =
    (await repo.getApplicationByStripeSession(session.id)) ||
    (meta.orderId ? await repo.getApplicationById(meta.orderId) : null) ||
    (meta.applicationId ? await repo.getApplicationByPublicId(meta.applicationId) : null);

  if (!existing) {
    return NextResponse.json({ received: true, recoverable: true, missing: "application" }, { status: 500 });
  }

  const paid = await repo.confirmPayment({
    id: existing.id,
    stripeSessionId: session.id,
    paymentReference: String(session.id),
    stripePaymentIntent: String(session.payment_intent || ""),
  });
  if (!paid || paid.paymentStatus !== "PAID") {
    return NextResponse.json({ received: true, recoverable: true, persist: "failed" }, { status: 500 });
  }

  try {
    const mail = await sendApplicationConfirmation(paid);
    await repo.appendAudit(mail.sent ? "email_sent" : "email_failed", mail.sent ? "sent" : mail.reason, {
      applicationId: paid.applicationId,
      identityId: paid.identityId,
    });
  } catch {
    await repo.appendAudit("email_failed", "provider", {
      applicationId: paid.applicationId,
      identityId: paid.identityId,
    });
  }

  await repo.retryPendingSheetsSync();
  return NextResponse.json({ received: true, applicationId: paid.applicationId });
}
