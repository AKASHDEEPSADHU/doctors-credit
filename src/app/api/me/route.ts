import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPatientById, patientLedger } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ patient: null }, { status: 401 });
  }
  const patient = getPatientById(session.patientId);
  if (!patient) {
    return NextResponse.json({ patient: null }, { status: 401 });
  }
  const ledger = patientLedger(patient.id);
  return NextResponse.json({
    patient: {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      country: patient.country,
      createdAt: patient.createdAt,
    },
    orders: ledger.orders,
    payments: ledger.payments,
  });
}
