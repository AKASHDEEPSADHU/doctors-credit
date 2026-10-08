import { NextResponse } from "next/server";
import { toAccountView } from "@/lib/account-view";
import { getSession } from "@/lib/session";
import { getPatientById, patientLedger } from "@/lib/store";
import { getRepository } from "@/lib/repo";

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
  const repo = await getRepository();
  const orders = await repo.assessments.list(patient.id);
  const assessmentOrders = await Promise.all(orders.map(async (order) => order.paymentProvider === "cashfree"
    ? { ...order, paymentAttempts: await repo.assessments.attempts(order.id) } : order));
  return NextResponse.json(toAccountView({
    patient, applications: ledger.applications, payments: ledger.payments,
    assessmentOrders,
  }), { headers: { "Cache-Control": "private, no-store" } });
}
