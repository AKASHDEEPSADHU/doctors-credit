import { CAUTION_POINTS } from "@/lib/india-medical-achievements";
import Reveal from "@/components/Reveal";
import { SectionLabel } from "@/components/editorial/SectionLabel";

export function WhatThisDoesNotMean() {
  return (
    <section className="ed-dark ma-caution" id="what-this-does-not-mean">
      <div className="shell">
        <SectionLabel>Limits of the record</SectionLabel>
        <h2>What this does NOT mean</h2>
        <ol>
          {CAUTION_POINTS.map((item) => (
            <li key={item.title}>
              <Reveal>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
