import { NextRequest, NextResponse } from "next/server";
import { firstError, parseApplicationInput } from "@/lib/application-fields";
import { scheduleTimezone } from "@/lib/appointment-slots";
import { fulfillPaidApplication } from "@/lib/fulfillment";
import { secureCookiesEnabled } from "@/lib/env";
import { requestOrigin, safeNext } from "@/lib/origin";
import { evaluateCheckoutAccess, resolveCheckoutProduct } from "@/lib/checkout-policy";
import { createCheckout } from "@/lib/dodo";
import { demoPayments } from "@/lib/env";
import { allowRequest, tooLarge } from "@/lib/rate-limit";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";

function failForm(origin: string, msg: string) {
  const url = new URL("/enroll", origin);
  url.searchParams.set("enrollError", msg);
  return NextResponse.redirect(url, 303);
}

function readFields(source: FormData | Record<string, unknown>) {
  const get = (key: string) => {
    if (source instanceof FormData) return String(source.get(key) || "");
    return String((source as Record<string, unknown>)[key] ?? "");
  };
  return {
    firstName: get("firstName"),
    lastName: get("lastName"),
    phone: get("phone"),
    usState: get("usState"),
    country: get("country"),
    procedureCategory: get("procedureCategory"),
    procedure: get("procedure"),
    insuranceStatus: get("insuranceStatus"),
    estimatedUsOop: get("estimatedUsOop"),
    preferredTimeline: get("preferredTimeline"),
    preferredConsultationDate: get("preferredConsultationDate"),
    appointmentTime: get("appointmentTime"),
    sku: get("sku") || "orientation",
    turnstile: get("cf-turnstile-response") || get("turnstileToken"),
  };
}

export async function POST(req: NextRequest) {
  const origin = requestOrigin(req);
  if (tooLarge(req, 32_000)) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }
  if (!allowRequest(req.headers, "checkout", 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Please wait and try again." }, { status: 429 });
  }

  const session = await getSession();
  if (!session || !evaluateCheckoutAccess(session).ok) {
    const next = encodeURIComponent("/enroll");
    return NextResponse.redirect(new URL(`/signin?next=${next}`, origin), 303);
  }

  const repo = await getRepository();
  const patient = await repo.getIdentityById(session.patientId);
  if (!patient) {
    return NextResponse.redirect(new URL("/signin?error=session", origin), 303);
  }

  const ct = req.headers.get("content-type") || "";
  let asForm = true;
  let fields: ReturnType<typeof readFields>;
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    asForm = false;
    fields = readFields(body as Record<string, unknown>);
  } else {
    const fd = await req.formData().catch(() => null);
    if (!fd) return failForm(origin, "Invalid request.");
    fields = readFields(fd);
  }

  const human = await verifyTurnstile(fields.turnstile, clientIp(req.headers));
  if (!human) {
    if (asForm) return failForm(origin, "Please complete the verification check.");
    return NextResponse.json({ error: "Please complete the verification check." }, { status: 400 });
  }

  const occupied = await repo.listPaidSlotOccupancy();
  const parsed = parseApplicationInput(fields, occupied);
  if (Object.keys(parsed.errors).length) {
    if (asForm) return failForm(origin, firstError(parsed.errors));
    return NextResponse.json({ error: firstError(parsed.errors), fields: parsed.errors }, { status: 400 });
  }

  const pkg = resolveCheckoutProduct({ sku: parsed.value.sku });
  if (!pkg.ok) {
    if (asForm) return failForm(origin, "That service is not available.");
    return NextResponse.json({ error: "That service is not available." }, { status: 400 });
  }

  const identity = await repo.upsertIdentity({
    email: patient.email,
    name: `${parsed.value.firstName} ${parsed.value.lastName}`.trim(),
    phone: parsed.value.phone,
    country: parsed.value.country,
    googleSub: patient.googleSub,
  });

  const application = await repo.createApplication({
    identityId: identity.id,
    email: identity.email,
    firstName: parsed.value.firstName,
    lastName: parsed.value.lastName,
    phone: parsed.value.phone,
    usState: parsed.value.usState,
    country: parsed.value.country,
    procedureCategory: parsed.value.procedureCategory,
    procedure: parsed.value.procedure,
    insuranceStatus: parsed.value.insuranceStatus,
    estimatedUsOop: parsed.value.estimatedUsOop,
    preferredTimeline: parsed.value.preferredTimeline,
    preferredConsultationDate: parsed.value.preferredConsultationDate,
    appointmentTime: parsed.value.appointmentTime,
    appointmentTimezone: scheduleTimezone(),
    sku: pkg.sku,
    amountCents: pkg.amountCents,
    source: "dcredit.in/enroll",
  });

  const cookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: secureCookiesEnabled(),
    path: "/",
    maxAge: 60 * 60 * 24,
  };

  if (demoPayments()) {
    const paid = await repo.confirmPayment({
      id: application.id,
      paymentReference: `demo-${application.applicationId}`,
    });
    if (!paid || paid.paymentStatus !== "PAID") {
      if (asForm) return failForm(origin, "The application could not be saved. No payment was taken.");
      return NextResponse.json({ error: "The application could not be saved." }, { status: 500 });
    }
    try {
      await fulfillPaidApplication(repo, paid);
    } catch {
      await repo.appendAudit("meeting_failed", "fulfillment", {
        applicationId: paid.applicationId,
        identityId: paid.identityId,
      });
    }
    const dest = safeNext("/success");
    if (asForm) {
      const res = NextResponse.redirect(new URL(dest, origin), 303);
      res.cookies.set("dc_application", paid.id, cookie);
      return res;
    }
    const res = NextResponse.json({ url: dest, applicationId: paid.applicationId });
    res.cookies.set("dc_application", paid.id, cookie);
    return res;
  }

  let checkout: Awaited<ReturnType<typeof createCheckout>> = null;
  try {
    checkout = await createCheckout({
      origin,
      email: identity.email,
      name: identity.name,
      sku: pkg.sku,
      applicationId: application.applicationId,
    });
  } catch {
    checkout = null;
  }
  if (!checkout?.url || !checkout.id) {
    if (asForm) return failForm(origin, "Checkout could not be started.");
    return NextResponse.json({ error: "Checkout could not be started." }, { status: 502 });
  }
  await repo.markPaymentInitiated(application.id, checkout.id);
  if (asForm) {
    const res = NextResponse.redirect(checkout.url, 303);
    res.cookies.set("dc_application", application.id, cookie);
    return res;
  }
  const res = NextResponse.json({ url: checkout.url });
  res.cookies.set("dc_application", application.id, cookie);
  return res;
}
