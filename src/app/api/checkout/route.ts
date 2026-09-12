import { NextRequest, NextResponse } from "next/server";
import { packageBySku } from "@/lib/packages";
import { setSession } from "@/lib/session";
import { createCheckout, demoPayments } from "@/lib/stripe";
import {
  attachStripeSession,
  createOrder,
  markOrderPaid,
  upsertPatient,
} from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const country = String(body.country || "").trim();
  const sku = String(body.sku || "orientation");
  const pkg = packageBySku(sku);
  if (!name || !email || !pkg) {
    return NextResponse.json(
      { error: "Name, email, and a package are required." },
      { status: 400 }
    );
  }

  const patient = upsertPatient({ email, name, phone, country });
  const order = createOrder({
    patientId: patient.id,
    sku: pkg.sku,
    title: pkg.name,
    amountCents: pkg.amountCents,
    currency: "usd",
    status: "pending",
  });

  const origin = req.nextUrl.origin;

  if (demoPayments()) {
    markOrderPaid(order.id);
    await setSession({ patientId: patient.id, email: patient.email });
    return NextResponse.json({ url: "/account?welcome=1" });
  }

  const session = await createCheckout({
    origin,
    email: patient.email,
    name: patient.name,
    sku: pkg.sku,
    title: pkg.name,
    amountCents: pkg.amountCents,
    orderId: order.id,
    patientId: patient.id,
  });
  if (!session?.url || !session.id) {
    return NextResponse.json(
      { error: "Checkout could not be started." },
      { status: 502 }
    );
  }
  attachStripeSession(order.id, session.id);
  return NextResponse.json({ url: session.url });
}
