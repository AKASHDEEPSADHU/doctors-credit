import EnrollForm from "@/components/EnrollForm";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { buildSlotCalendar } from "@/lib/appointment-slots";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { getPatientById } from "@/lib/store";

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export const metadata = { title: "Talk to a care coordinator | Doctor's Credit" };

const STEPS = [
  { n: "01", title: "Sign in", text: "Google opens your file before any money moves." },
  { n: "02", title: "Choose a time", text: "Pick a published conversation window." },
  { n: "03", title: "Pay $5", text: "One conversation. Not a booking for surgery." },
] as const;

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
      <div className="shell ed-enroll-grid">
        <div className="ed-enroll-copy">
          <SectionLabel>Talk to a care coordinator</SectionLabel>
          <h1>Tell us what you are considering.</h1>
          <p className="ed-lede">
            Your first step is a conversation about planned care, timing and
            whether India may be worth exploring.
          </p>
          <ol className="ed-enroll-steps">
            {STEPS.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="ed-enroll-note">
            This is a $5 one-time conversation with a DCredit care coordinator.
            It is not a diagnosis, clinical evaluation or medical-record review.
            Please do not send MRI scans, prescriptions or other sensitive
            records on this page.
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
