import { NextRequest, NextResponse } from "next/server";
import { staffLoginMatches } from "@/lib/env";
import { requestOrigin } from "@/lib/origin";
import { allowRequest, tooLarge } from "@/lib/rate-limit";
import { setStaffSession, staffConfigured } from "@/lib/staff-session";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  const origin = requestOrigin(req);
  if (tooLarge(req, 8_000)) {
    return NextResponse.redirect(new URL("/staff?error=invalid", origin), 303);
  }
  if (!allowRequest(req.headers, "staff-login", 8, 15 * 60 * 1000)) {
    return NextResponse.redirect(new URL("/staff?error=invalid", origin), 303);
  }
  if (!staffConfigured()) {
    return NextResponse.redirect(new URL("/staff?error=unconfigured", origin), 303);
  }
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.redirect(new URL("/staff?error=invalid", origin), 303);
  const token = String(fd.get("cf-turnstile-response") || "");
  if (!(await verifyTurnstile(token, clientIp(req.headers)))) {
    return NextResponse.redirect(new URL("/staff?error=turnstile", origin), 303);
  }
  const secret = String(fd.get("secret") || "");
  if (!staffLoginMatches(secret)) {
    return NextResponse.redirect(new URL("/staff?error=auth", origin), 303);
  }
  const res = NextResponse.redirect(new URL("/staff", origin), 303);
  await setStaffSession(res);
  return res;
}
