import { NextRequest, NextResponse } from "next/server";
import { isApplicationId, normalizePublicId } from "@/lib/ids";
import { allowRequest, tooLarge } from "@/lib/rate-limit";
import { getRepository } from "@/lib/repo";
import { staffAuthenticated } from "@/lib/staff-session";

export async function POST(req: NextRequest) {
  if (tooLarge(req, 8_000)) return NextResponse.json({ error: "Invalid request." }, { status: 413 });
  if (!allowRequest(req.headers, "staff-search", 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Please wait and try again." }, { status: 429 });
  }
  if (!(await staffAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const applicationId = normalizePublicId(String(body?.applicationId || ""));
  if (!isApplicationId(applicationId)) {
    return NextResponse.json({ error: "Search by Application ID only." }, { status: 400 });
  }
  const repo = await getRepository();
  const app = await repo.getApplicationByPublicId(applicationId);
  if (!app) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({
    applicationId: app.applicationId,
    conversationVerificationId: app.conversationVerificationId,
    firstName: app.firstName,
    lastName: app.lastName,
    paymentStatus: app.paymentStatus,
    applicationStatus: app.applicationStatus,
    assignedCoordinator: app.assignedCoordinator,
    preferredConsultationDate: app.preferredConsultationDate,
    procedureCategory: app.procedureCategory,
    procedure: app.procedure,
    notes: app.notes,
  });
}
