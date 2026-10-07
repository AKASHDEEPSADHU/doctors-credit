import { NextRequest, NextResponse } from "next/server";
import { allowRequest, tooLarge } from "@/lib/rate-limit";
import { getRepository } from "@/lib/repo";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  if (tooLarge(req, 12_000)) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }
  if (!allowRequest(req.headers, "contact", 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Please wait and try again." }, { status: 429 });
  }
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const token = String(fd.get("cf-turnstile-response") || fd.get("turnstileToken") || "");
  if (!(await verifyTurnstile(token, clientIp(req.headers)))) {
    return NextResponse.json({ error: "Please complete the verification check." }, { status: 400 });
  }
  const name = String(fd.get("name") || "").trim().slice(0, 80);
  const email = String(fd.get("email") || "").trim().toLowerCase().slice(0, 120);
  const message = String(fd.get("message") || "").trim().slice(0, 2000);
  if (name.length < 2 || !email.includes("@") || message.length < 10) {
    return NextResponse.json({ error: "Name, email and a short message are required." }, { status: 400 });
  }
  if (/(mri|ct scan|x-ray|prescription|diagnos)/i.test(message)) {
    return NextResponse.json(
      { error: "Please do not send medical records or diagnoses here. The $5 Initial Assessment also cannot accept imaging, prescriptions or detailed diagnoses." },
      { status: 400 }
    );
  }
  const repo = await getRepository();
  await repo.saveContact({ name, email, message });
  await repo.appendAudit("contact_submitted", "contact_form");
  return NextResponse.json({ ok: true });
}
