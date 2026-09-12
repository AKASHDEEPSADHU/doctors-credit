import { NextRequest, NextResponse } from "next/server";
import { getPatientByEmail } from "@/lib/store";
import { setSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  const patient = getPatientByEmail(email);
  if (!patient) {
    return NextResponse.json(
      { error: "No account for that email yet. Begin with Orientation." },
      { status: 404 }
    );
  }
  await setSession({ patientId: patient.id, email: patient.email });
  return NextResponse.json({ ok: true });
}
