import { appEnv, turnstileRequired } from "@/lib/env";

export async function verifyTurnstile(token: string | null | undefined, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (turnstileRequired()) return false;
    return appEnv() === "development";
  }
  if (!token) return false;
  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

/** Public widget key. Read on the server and passed into the browser as a prop. */
export function turnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
}

export function clientIp(headers: Headers) {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    ""
  );
}
