import { DIGITAL_NODES } from "@/lib/india-medical-achievements";
import { SourceCite } from "@/components/achievements/SourceCite";

export function DigitalHealthVisual() {
  return (
    <section className="ma-digital" id="digital-health">
      <div className="shell">
        <p className="eyebrow">National infrastructure</p>
        <h2>Digital health at national scale</h2>
        <ol className="ma-digital-flow">
          {DIGITAL_NODES.map((node) => (
            <li key={node}>{node}</li>
          ))}
        </ol>
        <p className="ma-chapter-stat">94.87 crore</p>
        <p className="ma-chapter-stat-note">ABHA digital health IDs by 20 July 2026</p>
        <p>
          Under the Ayushman Bharat Digital Mission, more than 94.87 crore ABHA
          IDs, 5.36 lakh health facilities and 10.09 lakh healthcare
          professionals had been registered as of 20 July 2026. In
          international units, those official figures are about 948.7 million
          IDs, 536,000 facilities and 1.01 million professionals.
        </p>
        <SourceCite id="pib-abdm-2026" />
        <p>
          The Healthcare Professionals Registry provides verified professional
          identities, while the Health Facility Registry provides a national
          digital directory of healthcare facilities. ABDM registration is not,
          by itself, a verification of clinical quality.
        </p>
        <SourceCite id="abdm-hpr" />
      </div>
    </section>
  );
}
