import { NextResponse } from "next/server";
import { toAccountView } from "@/lib/account-view";
import { getSession } from "@/lib/session";
import { getPatientById, patientLedger } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ patient: null }, { status: 401 });
  }
  const patient = await getPatientById(session.patientId);
  if (!patient) {
    return NextResponse.json({ patient: null }, { status: 401 });
  }
  const ledger = await patientLedger(patient.id);
  return NextResponse.json(toAccountView({ patient, applications: ledger.applications, payments: ledger.payments }));
}
