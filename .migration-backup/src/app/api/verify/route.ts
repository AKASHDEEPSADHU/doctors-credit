import { NextRequest, NextResponse } from "next/server";
import { isCallVerificationId, normalizePublicId } from "@/lib/ids";
import { allowRequest, tooLarge } from "@/lib/rate-limit";
import { getRepository } from "@/lib/repo";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  if (tooLarge(req, 8_000)) return NextResponse.json({ ok: false }, { status: 413 });
  if (!allowRequest(req.headers, "verify", 12, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ ok: false }, { status: 400 });
  const token = String(fd.get("cf-turnstile-response") || fd.get("turnstileToken") || "");
  if (!(await verifyTurnstile(token, clientIp(req.headers)))) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const callId = normalizePublicId(String(fd.get("callId") || ""));
  if (!isCallVerificationId(callId)) {
    return NextResponse.json({ ok: false });
  }
  const repo = await getRepository();
  const result = await repo.verifyCallId(callId);
  return NextResponse.json({ ok: result.ok === true });
}
