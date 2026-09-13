import { NextRequest, NextResponse } from "next/server";
import {
  demoGoogleAllowed,
  googleAuthorizeUrl,
  googleConfigured,
  newPkce,
  setOauthCookie,
} from "@/lib/google";
import { requestOrigin, safeNext } from "@/lib/origin";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";

async function startGoogle(req: NextRequest, nextRaw: string | null, turnstileToken: string | null) {
  const origin = requestOrigin(req);
  const next = safeNext(nextRaw);

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

export async function GET(req: NextRequest) {
  return startGoogle(req, req.nextUrl.searchParams.get("next"), req.nextUrl.searchParams.get("cf-turnstile-response"));
}

export async function POST(req: NextRequest) {
  const fd = await req.formData().catch(() => null);
  return startGoogle(
    req,
    fd ? String(fd.get("next") || "") : null,
    fd ? String(fd.get("cf-turnstile-response") || "") : null
  );
}
