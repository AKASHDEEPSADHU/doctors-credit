import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const COOKIE = "dc_staff";

function secret() {
  const s = process.env.STAFF_API_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export function staffConfigured() {
  return Boolean(process.env.STAFF_API_SECRET);
}

export async function setStaffSession(res?: NextResponse) {
  const key = secret();
  if (!key) return;
  const token = await new SignJWT({ role: "staff" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key);
  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  };
  if (res) res.cookies.set(COOKIE, token, opts);
  else (await cookies()).set(COOKIE, token, opts);
}

export async function staffAuthenticated() {
  const key = secret();
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
