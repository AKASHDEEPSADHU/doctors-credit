import { CAUTION_POINTS } from "@/lib/india-medical-achievements";
import Reveal from "@/components/Reveal";

export function WhatThisDoesNotMean() {
  return (
    <section className="ma-caution" id="what-this-does-not-mean">
      <div className="shell">
        <p className="eyebrow">Limits of the record</p>
        <h2>What this does not mean</h2>
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
