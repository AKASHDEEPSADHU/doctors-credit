import { getRepository } from "@/lib/repo";
import type { Application, Identity, PaymentRecord } from "@/lib/repo/types";

export type Patient = Identity;

export async function upsertPatient(input: {
  email: string;
  name: string;
  phone?: string;
  country?: string;
  googleSub?: string;
}): Promise<Identity> {
  return (await getRepository()).upsertIdentity(input);
}

export async function getPatientById(id: string) {
  return (await getRepository()).getIdentityById(id);
}

export async function getPatientByEmail(email: string) {
  return (await getRepository()).getIdentityByEmail(email);
}

export async function patientLedger(identityId: string) {
  const repo = await getRepository();
  const applications = await repo.listApplicationsForIdentity(identityId);
  const payments: PaymentRecord[] = [];
  for (const app of applications) {
    payments.push(...(await repo.listPayments(app.id)));
  }
  return { applications, payments };
}

export function codesFromApplication(app: Application | null) {
  if (!app || app.paymentStatus !== "PAID") return { publicId: undefined, verifyCode: undefined };
  return {
    publicId: app.applicationId,
    verifyCode: app.conversationVerificationId,
  };
}
