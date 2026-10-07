import { NextRequest, NextResponse } from "next/server";
import { isApplicationId, normalizePublicId } from "@/lib/ids";
import { allowRequest, tooLarge } from "@/lib/rate-limit";
import { getRepository } from "@/lib/repo";
import { staffAuthenticated } from "@/lib/staff-session";

export async function POST(req: NextRequest) {
  if (tooLarge(req, 8_000)) return NextResponse.json({ error: "Invalid request." }, { status: 413 });
  if (!allowRequest(req.headers, "staff-call", 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Please wait and try again." }, { status: 429 });
  }
  if (!(await staffAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const applicationId = body?.applicationId ? normalizePublicId(String(body.applicationId)) : "";
  if (applicationId && !isApplicationId(applicationId)) {
    return NextResponse.json({ error: "Invalid Application ID." }, { status: 400 });
  }
  const repo = await getRepository();
  const call = await repo.createCallVerification(applicationId || undefined, 120);
  return NextResponse.json({
    callId: call.callId,
    expiresAt: call.expiresAt,
  });
}
