import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function demoPayments() {
  return process.env.DEMO_PAYMENTS === "true" || !process.env.STRIPE_SECRET_KEY;
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
}) {
  const stripe = getStripe();
  if (!stripe) return null;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: opts.email,
    client_reference_id: opts.orderId,
    success_url: `${opts.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.origin}/enroll`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: opts.amountCents,
          product_data: {
            name: `Doctor's Credit — ${opts.title}`,
            description: `Independent Hyderabad direction · ${opts.name}`,
          },
        },
      },
    ],
    metadata: {
      orderId: opts.orderId,
      patientId: opts.patientId,
      sku: opts.sku,
    },
    integration_identifier: integrationId(opts.sku),
  });
  return session;
}
