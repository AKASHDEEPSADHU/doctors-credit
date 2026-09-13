import { NextRequest, NextResponse } from "next/server";
import { demoGoogleAllowed } from "@/lib/google";
import { requestOrigin, safeNext } from "@/lib/origin";
import { allowRequest, tooLarge } from "@/lib/rate-limit";
import { setSession } from "@/lib/session";
import { upsertPatient } from "@/lib/store";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  const origin = requestOrigin(req);
  const fail = (reason = "demo_disabled") =>
    NextResponse.redirect(new URL(`/signin?error=${reason}`, origin), 303);
  if (tooLarge(req, 16_000)) return fail("invalid");
  if (!allowRequest(req.headers, "google-demo", 5, 10 * 60 * 1000)) return fail("invalid");
  if (!demoGoogleAllowed()) return fail();

  const fd = await req.formData().catch(() => null);
  if (!fd) return fail("invalid");
  if (!(await verifyTurnstile(String(fd.get("cf-turnstile-response") || ""), clientIp(req.headers)))) {
    return fail("turnstile");
  }
  const next = safeNext(String(fd.get("next") || ""));
  const patient = await upsertPatient({
    email: "demo.google@doctors-credit.local",
    name: "Demo Google",
    googleSub: "demo-google-local",
  });
  const res = NextResponse.redirect(new URL(next, origin), 303);
  await setSession({ patientId: patient.id, email: patient.email }, res);
  return res;
}
