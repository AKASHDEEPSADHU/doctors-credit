import EnrollForm from "@/components/EnrollForm";
import { buildSlotCalendar } from "@/lib/appointment-slots";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { getPatientById } from "@/lib/store";

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export const metadata = { title: "$5 Initial Assessment — Doctor's Credit" };

export default async function EnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string | string[]; enrollError?: string | string[]; signedIn?: string | string[] }>;
}) {
  const q = await searchParams;
  const session = await getSession();
  const patient = session ? await getPatientById(session.patientId) : null;
  const repo = await getRepository();
  const calendar = buildSlotCalendar(await repo.listPaidSlotOccupancy());
  return (
    <main id="main" className="enroll-page">
      <div className="shell enroll-layout">
        <div>
          <p className="eyebrow">$5 Initial Assessment</p>
          <h2>For $5, understand whether exploring India even belongs in the conversation.</h2>
          <p className="section-lede">
            Sign in with Google. Choose a published conversation window. Then pay
            $5 for an initial conversation with a DCredit care coordinator — not
            a clinical assessment, diagnosis or medical-record review. After
            payment is confirmed you receive an Application ID, a Conversation
            Verification ID, and your Zoom join details when they are ready.
          </p>
          <p className="section-lede">
            Please do not send MRI scans, prescriptions, diagnoses or other
            sensitive medical records on this form.
          </p>
        </div>
        <EnrollForm
          patient={patient}
          error={first(q.enrollError)}
          calendar={calendar}
          justSignedIn={first(q.signedIn) === "1"}
        />
      </div>
    </main>
  );
}
