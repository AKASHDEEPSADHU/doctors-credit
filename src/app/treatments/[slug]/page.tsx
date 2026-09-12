import Link from "next/link";
import { notFound } from "next/navigation";
import { TREATMENTS, treatmentBySlug } from "@/lib/treatments";

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  return { title: t ? `${t.name} — Doctor's Credit` : "Treatment" };
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  if (!t) notFound();
  return (
    <main id="main" className="legal" style={{ maxWidth: "46rem" }}>
      <p className="eyebrow">{t.category}</p>
      <h1>{t.name}</h1>
      <p>
        Suitability for medical travel: <strong>{t.suitability}</strong>
      </p>
      <h2>What is the procedure?</h2>
      <p>{t.summary}</p>
      <h2>When might India be discussed?</h2>
      <p>{t.why}</p>
      <h2>US cost considerations</h2>
      <p>{t.usNotes} Typical US billed ranges vary by facility and market; they are not your bill. Your deductible, coinsurance, copay, remaining deductible, out-of-pocket maximum and network status decide exposure.</p>
      <h2>India journey considerations</h2>
      <p>{t.indiaNotes} Indicative India treatment ranges are estimates until a named hospital issues a plan. They may exclude flights, visa, lodging, companion costs, extra tests and follow-up.</p>
      <h2>When India may not be appropriate</h2>
      <p>
        Emergencies, inability to travel safely, inadequate follow-up in the US,
        or cases where your real US exposure is already lower than a complete
        India journey. DCredit does not diagnose.
      </p>
      <h2>Questions to take forward</h2>
      <p>Ask the doctor about alternatives, complications and clearance to fly. Ask the hospital what is included. Ask your US insurer what they will and will not pay. Ask us for a complete journey estimate — not a brochure price.</p>
      <Link className="btn-solid" href="/enroll">
        Start my $5 assessment
      </Link>
    </main>
  );
}
