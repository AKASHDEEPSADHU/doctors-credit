import { NextRequest } from "next/server";

export function requestOrigin(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!host) return req.nextUrl.origin;
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (req.nextUrl.protocol || "http:").replace(/:$/, "") ||
    "http";
  return `${proto}://${host}`;
}

export function safeNext(raw: string | null | undefined) {
  if (!raw) return "/enroll";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) {
    return "/enroll";
  }
  return raw;
}
