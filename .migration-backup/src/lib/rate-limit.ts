import { createHash } from "crypto";
import { clientIp } from "@/lib/turnstile";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 800) return;
  for (const [key, value] of buckets) {
    if (value.resetAt <= now) buckets.delete(key);
  }
}

function subject(headers: Headers) {
  const ip = clientIp(headers) || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 20);
}

/** Best-effort per-isolate limit. Prefer Cloudflare Rate Limiting in production. */
export function allowRequest(
  headers: Headers,
  scope: string,
  limit: number,
  windowMs: number
) {
  const now = Date.now();
  prune(now);
  const key = `${scope}:${subject(headers)}`;
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function tooLarge(req: { headers: Headers }, maxBytes: number) {
  const raw = req.headers.get("content-length");
  if (!raw) return false;
  const n = Number(raw);
  return Number.isFinite(n) && n > maxBytes;
}
