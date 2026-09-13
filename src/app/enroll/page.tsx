import EnrollForm from "@/components/EnrollForm";
import { buildSlotCalendar } from "@/lib/appointment-slots";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { getPatientById } from "@/lib/store";

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export const metadata = { title: "Talk to a care coordinator | Doctor's Credit" };

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
          <p className="eyebrow">Talk to a care coordinator</p>
          <h2>Tell us what you are considering and choose a convenient time for your conversation.</h2>
          <p className="section-lede">
            Your first step is a conversation. Start by signing in with Google,
            choosing a published conversation window, and paying the one-time
            fee shown beside this form.
          </p>
          <div className="care-intro">
            <p className="eyebrow">Initial Care Conversation</p>
            <p>
              Your first conversation with DCredit is a $5 one-time service.
            </p>
            <p>
              This is a conversation with a DCredit care coordinator. It is not
              a diagnosis, clinical evaluation, specialist medical opinion or
              medical-record review.
            </p>
          </div>
          <p className="section-lede">
            After payment is confirmed you receive an Application ID, a
            Conversation Verification ID, and your Zoom join details when they
            are ready. Please do not send MRI scans, prescriptions, diagnoses
            or other sensitive medical records on this form.
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
