import { PATIENT_FACTORS } from "@/lib/india-medical-achievements";
import { SourceCite } from "@/components/achievements/SourceCite";
import { SectionLabel } from "@/components/editorial/SectionLabel";

export function InternationalPatientFramework() {
  return (
    <section className="ma-international" id="international-patients">
      <div className="shell ma-international-grid">
        <div>
          <SectionLabel>For international patients</SectionLabel>
          <h2>What matters when considering care abroad?</h2>
          <p>
            India&apos;s medical achievements do not automatically mean that
            treatment in India is the right choice. They do mean there is a
            healthcare ecosystem worth investigating.
          </p>
          <p className="ma-international-note">
            Cost can be part of the decision. It should not be the whole
            decision.
          </p>
          <SourceCite id="nabh-find" />
        </div>
        <div className="ma-orbit" aria-label="Decision dimensions">
          <p>The right fit</p>
          <ul>
            {PATIENT_FACTORS.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
