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
  const patient = session ? getPatientById(session.patientId) : null;
  return (
    <main id="main" className="band-close enroll-page">
      <div className="shell enroll-layout">
        <div>
          <p className="eyebrow gold">Orientation</p>
          <h2>Five dollars so the first conversation is real.</h2>
          <p className="section-lede on-dark">
            Sign in with Google. Then pay. You receive a file: payments, orders,
            the history of what we have done together. If India is not the honest
            path, we will say so and still mean the five dollars.
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
