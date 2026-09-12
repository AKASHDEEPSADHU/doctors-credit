import { INDIA_STATS, SOURCES } from "@/lib/sources";

export const metadata = { title: "Research — Doctor's Credit" };

export default function ResearchPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Medical travel intelligence</p>
      <h1>Estimates are labeled. Counts have sources.</h1>

      <h2>India medical-purpose arrivals, 2025</h2>
      <p>
        India recorded {INDIA_STATS.medicalPurpose2025} foreign medical-purpose
        arrivals in 2025, about {INDIA_STATS.medicalShare} of {INDIA_STATS.fta2025}{" "}
        foreign tourist arrivals. Top source: {INDIA_STATS.topSource}. Other
        significant markets included {INDIA_STATS.otherSources.join(", ")}.
      </p>
      <p>{INDIA_STATS.caveat}</p>
      <p className="source">
        Source: {SOURCES.indiaMedicalArrivals2025.publisher}.{" "}
        {SOURCES.indiaMedicalArrivals2025.url}. Last verified{" "}
        {SOURCES.indiaMedicalArrivals2025.verified}. Label: VERIFIED.
      </p>

      <h2>Americans already travel abroad for medical care</h2>
      <p>
        CDC background material on medical tourism describes US residents
        traveling internationally for care — including lower cost, procedures not
        available at home, dental, fertility, cancer and cosmetic care — and
        also describes infection, continuity-of-care, post-return complications,
        insurance and legal-difference risks.
      </p>
      <p className="source">
        Source: {SOURCES.cdcMedicalTourism.publisher}. {SOURCES.cdcMedicalTourism.url}.
        Last verified {SOURCES.cdcMedicalTourism.verified}. Label: VERIFIED
        (agency background, not a DCredit patient count).
      </p>

      <h2>Your US insurance changes the math</h2>
      <p>
        A $50,000 US hospital bill does not necessarily mean you pay $50,000.
        Deductible, coinsurance, copay, out-of-pocket maximum, network status,
        coverage and prior authorization decide exposure. DCredit compares likely
        patient responsibility, not sticker prices.
      </p>
      <p className="source">
        Methodology: illustrative plan-math in the on-site calculator. Label:
        ESTIMATE. Limitations: not your plan; not a quote.
      </p>
    </main>
  );
}
