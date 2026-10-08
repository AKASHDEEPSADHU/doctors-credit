import { NextRequest, NextResponse } from "next/server";
import { startAssessmentCheckout } from "@/lib/assessment-checkout";
import { secureCookiesEnabled } from "@/lib/env";
import { requestOrigin } from "@/lib/origin";
import { allowRequest, tooLarge } from "@/lib/rate-limit";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  const origin = requestOrigin(req);
  if (req.headers.get("origin") !== origin || tooLarge(req, 8000)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (!allowRequest(req.headers, "assessment-checkout", 8, 600000)) return NextResponse.json({ error: "Please wait." }, { status: 429 });
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/signin?next=/enroll", origin), 303);
  const repo = await getRepository();
  const patient = await repo.getIdentityById(session.patientId);
  const form = await req.formData().catch(() => null);
  const fail = (message: string) => {
    const url = new URL("/enroll", origin);
    url.searchParams.set("enrollError", message);
    return NextResponse.redirect(url, 303);
  };
  if (!form) return fail("Invalid checkout request.");
  if (!await verifyTurnstile(String(form.get("cf-turnstile-response") || ""), clientIp(req.headers))) {
    return fail("Please complete the verification check.");
  }
  try {
    const result = await startAssessmentCheckout(repo, patient, origin, Object.fromEntries(form));
    const res = NextResponse.redirect(new URL(result.url, origin), 303);
    res.cookies.set("dc_assessment_order", result.order.id, {
      httpOnly: true, secure: secureCookiesEnabled(), sameSite: "lax", path: "/", maxAge: 86400,
    });
    return res;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Checkout could not be started. Do not pay again.");
  }
}
