import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { secureCookiesEnabled, sessionSecretBytes } from "@/lib/env";

const COOKIE = "dc_session";

function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: secureCookiesEnabled(),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

export type Session = { patientId: string; email: string };

export async function encodeSession(payload: Session) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(sessionSecretBytes());
}

export async function setSession(payload: Session, res?: NextResponse) {
  const token = await encodeSession(payload);
  if (res) {
    res.cookies.set(COOKIE, token, cookieOpts());
    return;
  }
  const jar = await cookies();
  jar.set(COOKIE, token, cookieOpts());
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", { ...cookieOpts(), maxAge: 0 });
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecretBytes());
    if (typeof payload.patientId !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { patientId: payload.patientId, email: payload.email };
  } catch {
    return null;
  }
}
