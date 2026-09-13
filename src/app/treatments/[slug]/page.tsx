import Link from "next/link";
import { notFound } from "next/navigation";
import { SUITABILITY_LABEL, TREATMENTS, treatmentBySlug } from "@/lib/treatments";

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  return { title: t ? `${t.name} | Doctor's Credit` : "Treatment" };
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
        Editorial note: <strong>{t.suitability}</strong>: {SUITABILITY_LABEL[t.suitability]}.
        This does not determine whether you should travel.
      </p>
      <h2>What is the procedure?</h2>
      <p>{t.summary}</p>
      <h2>What should you investigate?</h2>
      <p>
        Look at the procedure itself, relevant specialist expertise, technology,
        hospital capability, quality and accreditation, and practical fit. Do
        not treat a destination as a substitute for provider-level evidence.
      </p>
      <h2>When might India be discussed?</h2>
      <p>{t.why}</p>
      <h2>Costs at home</h2>
      <p>
        {t.usNotes} Typical billed ranges vary by facility and market; they are
        not your bill. Your healthcare coverage or funding, remaining
        deductible where that applies, coinsurance, copay and approved-provider
        rules decide what you may need to pay yourself.
      </p>
      <h2>India journey considerations</h2>
      <p>
        {t.indiaNotes} Indicative India treatment ranges are estimates until a
        named hospital issues a plan. They may exclude flights, visa, lodging,
        companion costs, extra tests and follow-up.
      </p>
      <h2>Reasons not to assume India is appropriate</h2>
      <p>
        Emergencies, inability to travel safely, inadequate follow-up at home,
        or cases where your real cost at home is already lower than a complete
        India journey. A lower quoted treatment price does not automatically
        make a medical journey better. DCredit does not diagnose, clear
        patients for travel or recommend a specific treatment.
      </p>
      <h2>Questions to take forward</h2>
      <p>
        Ask your own healthcare professionals about alternatives, complications
        and whether travel could later be appropriate. Ask any hospital what is
        included. Ask your insurer or funding body what they will and will not
        pay. The $5 Initial Assessment can help you organize those questions.
        It is not a specialist consultation.
      </p>
      <Link className="btn-solid" href="/enroll">
        Start my $5 Assessment
      </Link>
    </main>
  );
}
