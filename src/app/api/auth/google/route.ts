import { NextRequest, NextResponse } from "next/server";
import {
  demoGoogleAllowed,
  googleAuthorizeUrl,
  googleConfigured,
  newPkce,
  setOauthCookie,
} from "@/lib/google";
import { requestOrigin, safeNext } from "@/lib/origin";

export async function GET(req: NextRequest) {
  const origin = requestOrigin(req);
  const next = safeNext(req.nextUrl.searchParams.get("next"));

  if (!googleConfigured()) {
    const url = new URL("/signin", origin);
    url.searchParams.set("next", next);
    if (demoGoogleAllowed()) url.searchParams.set("demo", "1");
    else url.searchParams.set("error", "google_unconfigured");
    return NextResponse.redirect(url, 303);
  }

  const { verifier, challenge, state } = newPkce();
  const res = NextResponse.redirect(
    googleAuthorizeUrl({ origin, state, challenge }),
    303
  );
  await setOauthCookie(res, { state, verifier, next });
  return res;
}
