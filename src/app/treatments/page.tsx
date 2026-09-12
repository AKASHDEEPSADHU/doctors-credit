import Link from "next/link";
import { CATEGORIES, TREATMENTS } from "@/lib/treatments";

export const metadata = { title: "Treatments — Doctor's Credit" };

export default function TreatmentsPage() {
  return (
    <main id="main" className="legal" style={{ maxWidth: "52rem" }}>
      <p className="eyebrow">Treatment directory</p>
      <h1>Is this procedure suitable for medical travel?</h1>
      <p>
        Not every procedure should be marketed to US patients. Each entry is
        marked YES, POSSIBLY, or NOT GENERALLY — and some of the honest answers
        are “stay home.”
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
    </main>
  );
}
