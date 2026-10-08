import AssessmentForm from "@/components/AssessmentForm";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { assessmentCheckoutAllowed } from "@/lib/assessment";
import { appEnv } from "@/lib/env";
import { cashfreeEnvironment, cashfreeConfigured, cashfreeUsdAllowed } from "@/lib/payment-providers/cashfree";
import { activeAssessment } from "@/lib/repo/assessments";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { getPatientById } from "@/lib/store";

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export const metadata = { title: "Initial Patient Assessment | DCREDIT" };

const STEPS = [
  { n: "01", title: "Sign in", text: "Google opens your file before any money moves." },
  { n: "02", title: "Save patient type", text: "Domestic Patient: ₹999 INR. International Patient: USD 15." },
  { n: "03", title: "Initial Patient Assessment", text: "Secure payment for coordination and assistance. Live checkout is pending policy approval." },
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
  const orders = patient ? await repo.assessments.list(patient.id) : [];
  const order = activeAssessment(orders) || orders[0] || null;
  return (
    <main id="main" className="enroll-page">
      <div className="shell ed-enroll-grid">
        <div className="ed-enroll-copy">
          <SectionLabel>Initial Patient Assessment</SectionLabel>
          <h1>Begin with coordination and assistance.</h1>
          <p className="ed-lede">
            Sign in, save your patient type and review the initial coordination fee.
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
            DCredit is for patients anywhere in the world who are considering
            planned care in India. This fee is for coordination and assistance,
            not medical treatment, diagnosis, medical advice or medical-record intake.
            Please do not send MRI scans, prescriptions or other sensitive
            records on this page.
          </p>
        </div>
        <AssessmentForm
          patient={patient}
          error={first(q.enrollError)}
          order={order}
          testCheckoutAllowed={assessmentCheckoutAllowed(appEnv(), cashfreeEnvironment())}
          sandboxConfigured={cashfreeConfigured()}
          usdAllowed={cashfreeUsdAllowed()}
        />
      </div>
    </main>
  );
}
