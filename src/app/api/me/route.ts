import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { codesFromApplication, getPatientById, patientLedger } from "@/lib/store";

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
  const latestPaid = ledger.applications.find((a) => a.paymentStatus === "PAID") || null;
  const codes = codesFromApplication(latestPaid);
  return NextResponse.json({
    patient: {
      id: patient.id,
      publicId: codes.publicId,
      verifyCode: codes.verifyCode,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      country: patient.country,
      createdAt: patient.createdAt,
      applicationStatus: latestPaid?.applicationStatus,
    },
    orders: ledger.applications.map((a) => ({
      id: a.id,
      title: a.applicationId,
      sku: a.sku,
      amountCents: a.amountCents,
      currency: a.currency,
      status: a.paymentStatus === "PAID" ? "paid" : a.paymentStatus.toLowerCase(),
      createdAt: a.createdAt,
    })),
    payments: ledger.payments.map((p) => ({
      id: p.id,
      orderId: p.applicationId,
      amountCents: p.amountCents,
      currency: p.currency,
      createdAt: p.createdAt,
    })),
  });
}
