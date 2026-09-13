import Link from "next/link";
import { CATEGORIES, SUITABILITY_LABEL, TREATMENTS } from "@/lib/treatments";

export const metadata = { title: "Treatments | Doctor's Credit" };

export default function TreatmentsPage() {
  return (
    <main id="main" className="legal" style={{ maxWidth: "52rem" }}>
      <p className="eyebrow">What should you investigate?</p>
      <h1>Is this procedure often discussed for planned care abroad?</h1>
      <p>
        These notes are editorial and informational. They do not determine
        whether an individual patient should travel, and they are not a DCredit
        clinical review. Speak with your own healthcare professionals before
        making a treatment decision. Emergencies are never a DCredit pathway.
        India is a destination to investigate, not a conclusion.
      </p>
      {CATEGORIES.map((cat) => (
        <section key={cat}>
          <h2>{cat}</h2>
          <div className="dir-list">
            {TREATMENTS.filter((t) => t.category === cat).map((t) => (
              <Link href={`/treatments/${t.slug}`} key={t.slug}>
                <span>{t.suitability}</span>
                <strong>{t.name}</strong>
                <span>View</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <p className="source">
        Labels: YES, {SUITABILITY_LABEL.YES}. POSSIBLY, {SUITABILITY_LABEL.POSSIBLY}.
        NOT GENERALLY, {SUITABILITY_LABEL["NOT GENERALLY"]}.
      </p>
      <p>
        <Link className="btn-solid" href="/enroll">
          Talk to a care coordinator
        </Link>
      </p>
    </main>
  );
}
