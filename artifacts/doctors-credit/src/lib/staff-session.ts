import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { secureCookiesEnabled, staffConfigured, staffSecretBytes } from "@/lib/env";

const COOKIE = "dc_staff";

export { staffConfigured };

function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: secureCookiesEnabled(),
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}

/**
 * V1 staff authentication uses a shared operational credential (STAFF_API_SECRET)
 * for both login and JWT signing. There is no per-coordinator RBAC or revocation
 * list; signing out only clears this browser's cookie.
 */
export async function setStaffSession(res?: NextResponse) {
  const key = staffSecretBytes();
  if (!key) return;
  const token = await new SignJWT({ role: "staff" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key);
  if (res) res.cookies.set(COOKIE, token, cookieOpts());
  else (await cookies()).set(COOKIE, token, cookieOpts());
}

export async function clearStaffSession(res?: NextResponse) {
  const opts = { ...cookieOpts(), maxAge: 0 };
  if (res) res.cookies.set(COOKIE, "", opts);
  else (await cookies()).set(COOKIE, "", opts);
}

export async function staffAuthenticated() {
  const key = staffSecretBytes();
  if (!key) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload.role === "staff";
  } catch {
    return false;
  }
}
