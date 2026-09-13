import Link from "next/link";
import { JOURNEY } from "@/lib/journey";

export const metadata = { title: "How it works | Doctor's Credit" };

export default function HowItWorksPage() {
  return (
    <main id="main" className="legal" style={{ maxWidth: "48rem" }}>
      <p className="eyebrow">The DCredit 7-step journey</p>
      <h1>Know your options before you decide.</h1>
      <p>
        This journey is about informed decision-making. You have not already
        chosen India by starting it. We are building DCredit in stages,
        starting with the decision itself. The current paid service is the $5
        Initial Assessment: a conversation with DCredit, not a clinical
        assessment or medical evaluation.
      </p>
      {JOURNEY.map((s) => (
        <section key={s.n}>
          <h2>
            {s.n}. {s.title}
          </h2>
          <p>{s.body}</p>
        </section>
      ))}
      <p>
        DCredit does not independently diagnose, prescribe, clear patients for
        travel or store medical records in V1. Final clinical terms are
        determined by qualified healthcare professionals and the concerned
        healthcare institution.
      </p>
      <Link className="btn-solid" href="/enroll">
        Talk to a care coordinator
      </Link>
    </main>
  );
}
