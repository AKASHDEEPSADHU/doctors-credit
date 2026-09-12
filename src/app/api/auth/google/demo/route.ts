import { NextRequest, NextResponse } from "next/server";
import { demoGoogleAllowed } from "@/lib/google";
import { requestOrigin, safeNext } from "@/lib/origin";
import { setSession } from "@/lib/session";
import { upsertPatient } from "@/lib/store";

export async function POST(req: NextRequest) {
  const origin = requestOrigin(req);
  const fail = () => NextResponse.redirect(new URL("/signin?error=demo_disabled", origin), 303);
  if (!demoGoogleAllowed()) return fail();

  const fd = await req.formData().catch(() => null);
  const next = safeNext(fd ? String(fd.get("next") || "") : "");
  const patient = upsertPatient({
    email: "demo.google@doctors-credit.local",
    name: "Demo Google",
    googleSub: "demo-google-local",
  });
  const res = NextResponse.redirect(new URL(next, origin), 303);
  await setSession({ patientId: patient.id, email: patient.email }, res);
  return res;
}
