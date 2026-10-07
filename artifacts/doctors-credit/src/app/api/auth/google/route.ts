import { NextRequest, NextResponse } from "next/server";
import {
  demoGoogleAllowed,
  googleAuthorizeUrl,
  googleConfigured,
  newPkce,
  setOauthCookie,
} from "@/lib/google";
import { requestOrigin, safeNext } from "@/lib/origin";
import { allowRequest, tooLarge } from "@/lib/rate-limit";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";

export async function GET(req: NextRequest) {
  const origin = requestOrigin(req);
  const next = safeNext(req.nextUrl.searchParams.get("next"));
  const url = new URL("/signin", origin);
  url.searchParams.set("next", next);
  return NextResponse.redirect(url, 303);
}

export async function POST(req: NextRequest) {
  const origin = requestOrigin(req);
  if (tooLarge(req, 16_000)) {
    return NextResponse.redirect(new URL("/signin?error=invalid", origin), 303);
  }
  if (!allowRequest(req.headers, "google-auth", 10, 10 * 60 * 1000)) {
    return NextResponse.redirect(new URL("/signin?error=invalid", origin), 303);
  }
  const fd = await req.formData().catch(() => null);
  const next = safeNext(fd ? String(fd.get("next") || "") : null);
  const turnstileToken = fd ? String(fd.get("cf-turnstile-response") || "") : null;

  if (!(await verifyTurnstile(turnstileToken, clientIp(req.headers)))) {
    const url = new URL("/signin", origin);
    url.searchParams.set("next", next);
    url.searchParams.set("error", "turnstile");
    return NextResponse.redirect(url, 303);
  }

  if (!googleConfigured()) {
    const url = new URL("/signin", origin);
    url.searchParams.set("next", next);
    if (demoGoogleAllowed()) url.searchParams.set("demo", "1");
    else url.searchParams.set("error", "google_unconfigured");
    return NextResponse.redirect(url, 303);
  }

  const { verifier, challenge, state } = newPkce();
  const res = NextResponse.redirect(googleAuthorizeUrl({ origin, state, challenge }), 303);
  await setOauthCookie(res, { state, verifier, next });
  return res;
}
