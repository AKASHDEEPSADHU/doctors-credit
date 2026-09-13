import EnrollForm from "@/components/EnrollForm";
import { getSession } from "@/lib/session";
import { getPatientById } from "@/lib/store";

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export const metadata = { title: "$5 Initial Assessment — Doctor's Credit" };

export default async function EnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string | string[]; enrollError?: string | string[] }>;
}) {
  const q = await searchParams;
  const session = await getSession();
  const patient = session ? await getPatientById(session.patientId) : null;
  return (
    <main id="main" className="enroll-page">
      <div className="shell enroll-layout">
        <div>
          <p className="eyebrow">$5 Initial Assessment</p>
          <h2>For $5, understand whether exploring India even belongs in the conversation.</h2>
          <p className="section-lede">
            Sign in with Google. Then pay $5 for an initial conversation with a
            DCredit care coordinator — not a clinical assessment, diagnosis or
            medical-record review. After payment is confirmed you receive an
            Application ID and a Conversation Verification ID for genuine
            communication. We will never ask for passwords, banking PINs, card
            CVV or one-time authentication codes.
          </p>
          <p className="section-lede">
            Please do not send MRI scans, prescriptions, diagnoses or other
            sensitive medical records on this form.
          </p>
        </div>
        <EnrollForm patient={patient} error={first(q.enrollError)} />
      </div>
    </main>
  );
}
