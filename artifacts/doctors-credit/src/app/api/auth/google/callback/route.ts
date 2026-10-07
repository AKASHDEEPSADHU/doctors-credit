import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  clearOauthCookie,
  exchangeGoogleCode,
  googleConfigured,
  readOauthCookie,
} from "@/lib/google";
import { requestOrigin, safeNext } from "@/lib/origin";
import { setSession } from "@/lib/session";
import { upsertPatient } from "@/lib/store";

export async function GET(req: NextRequest) {
  const origin = requestOrigin(req);
  const fail = (reason: string) => {
    const url = new URL("/signin", origin);
    url.searchParams.set("error", reason);
    return NextResponse.redirect(url, 303);
  };

  if (!googleConfigured()) return fail("google_unconfigured");

  const err = req.nextUrl.searchParams.get("error");
  if (err) return fail(err);

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  if (!code || !state) return fail("missing_code");

  const jar = await cookies();
  const oauth = await readOauthCookie(jar.get("dc_oauth")?.value);
  if (!oauth || oauth.state !== state) return fail("bad_state");

  const google = await exchangeGoogleCode({
    origin,
    code,
    verifier: oauth.verifier,
  });
  if (!google) return fail("google_failed");

  const patient = await upsertPatient({
    email: google.email,
    name: google.name,
    googleSub: google.sub,
  });

  const dest = new URL(safeNext(oauth.next), origin);
  dest.searchParams.set("signedIn", "1");
  const res = NextResponse.redirect(dest, 303);
  clearOauthCookie(res);
  await setSession({ patientId: patient.id, email: patient.email }, res);
  return res;
}
