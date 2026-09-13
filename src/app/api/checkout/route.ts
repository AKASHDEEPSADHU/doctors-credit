import { NextRequest, NextResponse } from "next/server";
import { firstError, parseApplicationInput } from "@/lib/application-fields";
import { sendApplicationConfirmation } from "@/lib/email";
import { requestOrigin, safeNext } from "@/lib/origin";
import { packageBySku } from "@/lib/packages";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { createCheckout, demoPayments } from "@/lib/stripe";
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
    sku: get("sku") || "orientation",
    turnstile: get("cf-turnstile-response") || get("turnstileToken"),
  };
}

export async function POST(req: NextRequest) {
  const origin = requestOrigin(req);
  const session = await getSession();
  if (!session) {
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

  const parsed = parseApplicationInput(fields);
  if (Object.keys(parsed.errors).length) {
    if (asForm) return failForm(origin, firstError(parsed.errors));
    return NextResponse.json({ error: firstError(parsed.errors), fields: parsed.errors }, { status: 400 });
  }

  const pkg = packageBySku(parsed.value.sku);
  if (!pkg) {
    if (asForm) return failForm(origin, "Choose a package.");
    return NextResponse.json({ error: "Choose a package." }, { status: 400 });
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
    sku: pkg.sku,
    amountCents: pkg.amountCents,
    source: "dcredit.in/enroll",
  });

  const cookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
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

  const checkout = await createCheckout({
    origin,
    email: identity.email,
    name: identity.name,
    sku: pkg.sku,
    title: pkg.name,
    amountCents: pkg.amountCents,
    orderId: application.id,
    patientId: identity.id,
    applicationId: application.applicationId,
  });
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
