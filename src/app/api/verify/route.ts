import { NextRequest, NextResponse } from "next/server";
import { isCallVerificationId, normalizePublicId } from "@/lib/ids";
import { getRepository } from "@/lib/repo";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ ok: false }, { status: 400 });
  const token = String(fd.get("cf-turnstile-response") || fd.get("turnstileToken") || "");
  if (!(await verifyTurnstile(token, clientIp(req.headers)))) {
    return NextResponse.json({ ok: false, error: "verification_check" }, { status: 400 });
  }
  const callId = normalizePublicId(String(fd.get("callId") || ""));
  if (!isCallVerificationId(callId)) {
    return NextResponse.json({ ok: false });
  }
  const repo = await getRepository();
  const result = await repo.verifyCallId(callId);
  return NextResponse.json({ ok: result.ok === true });
}
