import Stripe from "stripe";
import { demoPayments } from "@/lib/env";

export { demoPayments };

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function integrationId(sku: string) {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `dc-${sku}-${suffix}`;
}

export async function createCheckout(opts: {
  origin: string;
  email: string;
  name: string;
  sku: string;
  title: string;
  amountCents: number;
  orderId: string;
  patientId: string;
  applicationId: string;
}) {
  const stripe = getStripe();
  if (!stripe) return null;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: opts.email,
    client_reference_id: opts.orderId,
    success_url: `${opts.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.origin}/enroll?resume=1`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: opts.amountCents,
          product_data: {
            name: `Doctor's Credit — ${opts.title}`,
            description: "DCredit $5 Initial Assessment",
          },
        },
      },
    ],
    metadata: {
      orderId: opts.orderId,
      patientId: opts.patientId,
      sku: opts.sku,
      applicationId: opts.applicationId,
    },
    integration_identifier: integrationId(opts.sku),
  });
  return session;
}
