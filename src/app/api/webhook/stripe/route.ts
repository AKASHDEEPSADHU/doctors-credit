import { NextRequest, NextResponse } from "next/server";
import { sendApplicationConfirmationOnce } from "@/lib/email";
import { getRepository } from "@/lib/repo";
import { getStripe } from "@/lib/stripe";
import { tooLarge } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  if (tooLarge(req, 256_000)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 413 });
  }

  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Payment confirmation is not configured." }, { status: 503 });
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
    return NextResponse.json({ received: true });
  }

  const repo = await getRepository();
  const meta = session.metadata || {};
  const existing =
    (await repo.getApplicationByStripeSession(session.id)) ||
    (meta.orderId ? await repo.getApplicationById(meta.orderId) : null) ||
    (meta.applicationId ? await repo.getApplicationByPublicId(meta.applicationId) : null);

  if (!existing) {
    return NextResponse.json({ error: "Application not found." }, { status: 500 });
  }

  const alreadyPaid = existing.paymentStatus === "PAID";
  const paid = await repo.confirmPayment({
    id: existing.id,
    stripeSessionId: session.id,
    paymentReference: String(session.id),
    stripePaymentIntent: String(session.payment_intent || ""),
  });
  if (!paid || paid.paymentStatus !== "PAID") {
    return NextResponse.json({ error: "Could not record payment." }, { status: 500 });
  }

  try {
    const mail = await sendApplicationConfirmationOnce(paid, alreadyPaid);
    if (mail.reason !== "already_confirmed") {
      await repo.appendAudit(mail.sent ? "email_sent" : "email_failed", mail.sent ? "sent" : mail.reason, {
        applicationId: paid.applicationId,
        identityId: paid.identityId,
      });
    }
  } catch {
    await repo.appendAudit("email_failed", "provider", {
      applicationId: paid.applicationId,
      identityId: paid.identityId,
    });
  }

  await repo.retryPendingSheetsSync();
  return NextResponse.json({ received: true });
}
