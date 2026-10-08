import { NextRequest, NextResponse } from "next/server";
import { isPatientType } from "@/lib/assessment";
import { requestOrigin } from "@/lib/origin";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { allowRequest, tooLarge } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const origin = requestOrigin(req);
  const redirect = (message?: string) => {
    const url = new URL("/enroll", origin);
    if (message) url.searchParams.set("enrollError", message);
    return NextResponse.redirect(url, 303);
  };
  if (req.headers.get("origin") !== origin || tooLarge(req, 4000)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (!allowRequest(req.headers, "patient-type", 20, 600000)) return NextResponse.json({ error: "Please wait." }, { status: 429 });
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/signin?next=/enroll", origin), 303);
  const form = await req.formData().catch(() => null);
  const type = form?.get("patientType");
  if (!isPatientType(type)) return redirect("Choose Domestic Patient or International Patient.");
  const repo = await getRepository();
  const saved = await repo.setPatientType(session.patientId, type);
  if (!saved) return redirect("Patient type cannot be changed while an assessment payment is pending, confirmed or under review.");
  return redirect();
}
