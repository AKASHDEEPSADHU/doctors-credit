import { NextRequest, NextResponse } from "next/server";
import { packageBySku } from "@/lib/packages";
import { requestOrigin, safeNext } from "@/lib/origin";
import { getSession } from "@/lib/session";
import { createCheckout, demoPayments } from "@/lib/stripe";
import {
  attachStripeSession,
  createOrder,
  getPatientById,
  markOrderPaid,
  upsertPatient,
} from "@/lib/store";

function failForm(origin: string, msg: string) {
  const url = new URL("/enroll", origin);
  url.searchParams.set("enrollError", msg);
  return NextResponse.redirect(url, 303);
}

export async function POST(req: NextRequest) {
  const origin = requestOrigin(req);
  const session = await getSession();
  if (!session) {
    const next = encodeURIComponent("/enroll");
    return NextResponse.redirect(new URL(`/signin?next=${next}`, origin), 303);
  }

  const patient = getPatientById(session.patientId);
  if (!patient) {
    return NextResponse.redirect(new URL("/signin?error=session", origin), 303);
  }

  const ct = req.headers.get("content-type") || "";
  let sku = "orientation";
  let phone = "";
  let country = "";
  let asForm = true;
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    asForm = false;
    sku = String(body.sku || "orientation");
    phone = String(body.phone || "").trim();
    country = String(body.country || "").trim();
  } else {
    const fd = await req.formData().catch(() => null);
    if (!fd) return failForm(origin, "Invalid request.");
    sku = String(fd.get("sku") || "orientation");
    phone = String(fd.get("phone") || "").trim();
    country = String(fd.get("country") || "").trim();
  }

  const pkg = packageBySku(sku);
  if (!pkg) {
    if (asForm) return failForm(origin, "Choose a package.");
    return NextResponse.json({ error: "Choose a package." }, { status: 400 });
  }

  const fresh = upsertPatient({
    email: patient.email,
    name: patient.name,
    phone,
    country,
    googleSub: patient.googleSub,
  });

  const order = createOrder({
    patientId: fresh.id,
    sku: pkg.sku,
    title: pkg.name,
    amountCents: pkg.amountCents,
    currency: "usd",
    status: "pending",
  });

  if (demoPayments()) {
    markOrderPaid(order.id);
    const dest = safeNext("/account?welcome=1");
    if (asForm) {
      return NextResponse.redirect(new URL(dest, origin), 303);
    }
    return NextResponse.json({ url: dest });
  }

  const checkout = await createCheckout({
    origin,
    email: fresh.email,
    name: fresh.name,
    sku: pkg.sku,
    title: pkg.name,
    amountCents: pkg.amountCents,
    orderId: order.id,
    patientId: fresh.id,
  });
  if (!checkout?.url || !checkout.id) {
    if (asForm) return failForm(origin, "Checkout could not be started.");
    return NextResponse.json({ error: "Checkout could not be started." }, { status: 502 });
  }
  attachStripeSession(order.id, checkout.id);
  if (asForm) return NextResponse.redirect(checkout.url, 303);
  return NextResponse.json({ url: checkout.url });
}
