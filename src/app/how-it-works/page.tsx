import Link from "next/link";
import { JOURNEY } from "@/lib/journey";

export const metadata = { title: "How it works — Doctor's Credit" };

export default function HowItWorksPage() {
  return (
    <main id="main" className="legal" style={{ maxWidth: "48rem" }}>
      <p className="eyebrow">The DCredit 7-step journey</p>
      <h1>Know your options before you decide.</h1>
      <p>
        We do not begin by selling an Indian hospital. We begin by understanding
        what treatment you need, whether it is planned, what you may actually pay
        in the US, and whether India is a sensible option.
      </p>
      {JOURNEY.map((s) => (
        <section key={s.n}>
          <h2>
            {s.n} — {s.title}
          </h2>
          <p>{s.body}</p>
        </section>
      ))}
      <p>
        DCredit does not independently diagnose or prescribe treatment. Final
        clinical terms are determined by the concerned healthcare institution.
      </p>
      <Link className="btn-solid" href="/enroll">
        Book my $5 assessment
      </Link>
    </main>
  );
}
