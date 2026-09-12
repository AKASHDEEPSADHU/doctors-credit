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

async function readFields(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return null;
    return {
      form: false,
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      country: String(body.country || "").trim(),
      sku: String(body.sku || "orientation"),
    };
  }
  const fd = await req.formData().catch(() => null);
  if (!fd) return null;
  return {
    form: true,
    name: String(fd.get("name") || "").trim(),
    email: String(fd.get("email") || "").trim(),
    phone: String(fd.get("phone") || "").trim(),
    country: String(fd.get("country") || "").trim(),
    sku: String(fd.get("sku") || "orientation"),
  };
}

export async function POST(req: NextRequest) {
  const fields = await readFields(req);
  const origin = req.nextUrl.origin;
  if (!fields) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const pkg = packageBySku(fields.sku);
  if (!fields.name || !fields.email || !pkg) {
    if (fields.form) {
      const url = new URL("/", origin);
      url.searchParams.set("enrollError", "Name, email, and a package are required.");
      return NextResponse.redirect(url, 303);
    }
    return NextResponse.json(
      { error: "Name, email, and a package are required." },
      { status: 400 }
    );
  }

  const patient = upsertPatient({
    email: fields.email,
    name: fields.name,
    phone: fields.phone,
    country: fields.country,
  });
  const order = createOrder({
    patientId: patient.id,
    sku: pkg.sku,
    title: pkg.name,
    amountCents: pkg.amountCents,
    currency: "usd",
    status: "pending",
  });

  if (demoPayments()) {
    markOrderPaid(order.id);
    if (fields.form) {
      const res = NextResponse.redirect(new URL("/account?welcome=1", origin), 303);
      await setSession({ patientId: patient.id, email: patient.email }, res);
      return res;
    }
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
    if (fields.form) {
      const url = new URL("/", origin);
      url.searchParams.set("enrollError", "Checkout could not be started.");
      return NextResponse.redirect(url, 303);
    }
    return NextResponse.json(
      { error: "Checkout could not be started." },
      { status: 502 }
    );
  }
  attachStripeSession(order.id, session.id);
  if (fields.form) {
    return NextResponse.redirect(session.url, 303);
  }
  return NextResponse.json({ url: session.url });
}
