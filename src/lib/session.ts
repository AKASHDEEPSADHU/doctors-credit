import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "dc_session";

function secret() {
  const s = process.env.SESSION_SECRET || "dev-only-change-me-doctors-credit";
  return new TextEncoder().encode(s);
}

export type Session = { patientId: string; email: string };

export async function setSession(payload: Session) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.patientId !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { patientId: payload.patientId, email: payload.email };
  } catch {
    return null;
  }
}
