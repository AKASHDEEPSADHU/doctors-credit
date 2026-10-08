import { NextRequest, NextResponse } from "next/server";
import { verifyAssessmentPayment } from "@/lib/assessment-verification";
import { requestOrigin } from "@/lib/origin";
import { allowRequest, tooLarge } from "@/lib/rate-limit";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== requestOrigin(req) || tooLarge(req, 2000)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (!allowRequest(req.headers, "assessment-verify", 20, 600000)) return NextResponse.json({ error: "Please wait." }, { status: 429 });
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const repo = await getRepository();
  const input = await req.json().catch(() => null);
  const order = typeof input?.orderId === "string" ? await repo.assessments.get(input.orderId) : null;
  if (!order || order.identityId !== session.patientId) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  try {
    const saved = await verifyAssessmentPayment(repo, order.id);
    const attempts = await repo.assessments.attempts(order.id);
    return NextResponse.json({ status: saved.status, attemptStatus: attempts.at(-1)?.status, review: Boolean(saved.reviewReason) });
  } catch {
    return NextResponse.json({ error: "Payment status could not yet be verified. Do not pay again." }, { status: 503 });
  }
}
