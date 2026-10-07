import { DIGITAL_NODES } from "@/lib/india-medical-achievements";
import { SourceCite } from "@/components/achievements/SourceCite";
import { SectionLabel } from "@/components/editorial/SectionLabel";

export function DigitalHealthVisual() {
  return (
    <section className="ma-digital" id="digital-health">
      <div className="shell ed-network-wrap">
        <div>
          <SectionLabel>National infrastructure</SectionLabel>
          <h2>Digital health</h2>
          <p className="ed-num">94.87 crore</p>
          <p className="ed-metric-note">ABHA digital health IDs by 20 July 2026</p>
        </div>
        <div className="ed-network-map" aria-label="Digital health connections">
          <p>Digital health</p>
          <ul className="ed-network">
            {DIGITAL_NODES.map((node) => (
              <li key={node}>{node}</li>
            ))}
          </ul>
        </div>
        <div>
          <p>
            Under the Ayushman Bharat Digital Mission, more than 94.87 crore
            ABHA IDs, 5.36 lakh health facilities and 10.09 lakh healthcare
            professionals had been registered as of 20 July 2026.
          </p>
          <SourceCite id="pib-abdm-2026" />
          <p>
            ABDM registration is a digital identity and directory layer. It is
            not, by itself, a verification of clinical quality.
          </p>
          <SourceCite id="abdm-hpr" />
        </div>
      </div>
    </section>
  );
}
