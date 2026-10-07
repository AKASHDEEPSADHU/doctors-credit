import { createHash, randomBytes } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import type { NextResponse } from "next/server";
import { demoGoogleAllowed, secureCookiesEnabled, sessionSecretBytes } from "@/lib/env";

const OAUTH_COOKIE = "dc_oauth";

export type OauthPayload = {
  state: string;
  verifier: string;
  next: string;
};

export { demoGoogleAllowed };

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function googleClientId() {
  return process.env.GOOGLE_CLIENT_ID || "";
}

export function newPkce() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const state = randomBytes(24).toString("hex");
  return { verifier, challenge, state };
}

export function googleAuthorizeUrl(opts: {
  origin: string;
  state: string;
  challenge: string;
}) {
  const redirect = `${opts.origin}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: googleClientId(),
    redirect_uri: redirect,
    response_type: "code",
    scope: "openid email profile",
    state: opts.state,
    code_challenge: opts.challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function setOauthCookie(res: NextResponse, payload: OauthPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(sessionSecretBytes());
  res.cookies.set(OAUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookiesEnabled(),
    path: "/",
    maxAge: 60 * 10,
  });
}

export async function readOauthCookie(token: string | undefined): Promise<OauthPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecretBytes());
    if (
      typeof payload.state !== "string" ||
      typeof payload.verifier !== "string" ||
      typeof payload.next !== "string"
    ) {
      return null;
    }
    return {
      state: payload.state,
      verifier: payload.verifier,
      next: payload.next,
    };
  } catch {
    return null;
  }
}

export function clearOauthCookie(res: NextResponse) {
  res.cookies.set(OAUTH_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function exchangeGoogleCode(opts: {
  origin: string;
  code: string;
  verifier: string;
}) {
  const body = new URLSearchParams({
    code: opts.code,
    client_id: googleClientId(),
    client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirect_uri: `${opts.origin}/api/auth/google/callback`,
    grant_type: "authorization_code",
    code_verifier: opts.verifier,
  });
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!tokenRes.ok) return null;
  const tokens = (await tokenRes.json()) as { access_token?: string };
  if (!tokens.access_token) return null;
  const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!userRes.ok) return null;
  const user = (await userRes.json()) as {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
  };
  if (!user.email || !user.sub) return null;
  return {
    sub: user.sub,
    email: user.email,
    name: user.name || user.email.split("@")[0],
  };
}
