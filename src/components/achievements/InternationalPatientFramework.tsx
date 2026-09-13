import { PATIENT_FACTORS, QUALITY_CARDS } from "@/lib/india-medical-achievements";
import { SourceCite } from "@/components/achievements/SourceCite";

export function InternationalPatientFramework() {
  return (
    <>
      <section className="ma-quality" id="quality">
        <div className="shell">
          <p className="eyebrow">Quality and accreditation</p>
          <h2>
            Capability matters.
            <br />
            Verification matters too.
          </h2>
          <p className="section-lede">
            India has developed formal healthcare accreditation mechanisms. The
            National Accreditation Board for Hospitals &amp; Healthcare
            Providers (NABH) establishes healthcare standards intended to
            promote quality and patient safety.
          </p>
          <ul className="ma-quality-grid">
            {QUALITY_CARDS.map((card) => (
              <li key={card.title}>
                <details>
                  <summary>{card.title}</summary>
                  <p>{card.text}</p>
                </details>
              </li>
            ))}
          </ul>
          <p>
            NABH accreditation alone does not guarantee a good outcome. It is
            one quality signal among others that should be independently
            evaluated.
          </p>
          <SourceCite id="nabh-find" />
        </div>
      </section>

      <section className="ma-international" id="international-patients">
        <div className="shell ma-international-grid">
          <div>
            <p className="eyebrow">For international patients</p>
            <h2>Why do people look beyond their home country?</h2>
            <p>
              India&apos;s medical achievements do not automatically mean that
              treatment in India is the right choice. They do mean there is a
              healthcare ecosystem worth investigating.
            </p>
            <p className="ma-international-note">
              Cost can be part of the decision. It should not be the whole
              decision.
            </p>
          </div>
          <div className="ma-orbit" aria-label="Decision factors">
            <p>The right fit</p>
            <ul>
              {PATIENT_FACTORS.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
