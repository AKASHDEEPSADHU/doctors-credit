import EnrollForm from "@/components/EnrollForm";
import { getSession } from "@/lib/session";
import { getPatientById } from "@/lib/store";

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

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
          <p className="eyebrow">$5 initial care assessment</p>
          <h2>For $5, understand whether India even belongs in the conversation.</h2>
          <p className="section-lede">
            Sign in with Google. Then pay $5. After payment is confirmed you
            receive an Application ID and a Conversation Verification ID for
            genuine communication. We will never ask for passwords, banking PINs,
            card CVV or one-time authentication codes.
          </p>
        </div>
        <EnrollForm
          patient={patient}
          sku={first(q.sku)}
          error={first(q.enrollError)}
        />
      </div>
    </main>
  );
}
