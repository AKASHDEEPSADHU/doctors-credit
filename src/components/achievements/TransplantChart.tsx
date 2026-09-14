"use client";

import { useEffect, useRef, useState } from "react";
import { TRANSPLANT_BARS } from "@/lib/india-medical-achievements";
import { SourceCite } from "@/components/achievements/SourceCite";
import { SectionLabel } from "@/components/editorial/SectionLabel";

export function TransplantChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.28 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const max = Math.max(...TRANSPLANT_BARS.map((item) => item.value));

  return (
    <section className="ed-dark ma-transplant" id="transplantation" ref={ref}>
      <div className="shell">
        <SectionLabel>National scale</SectionLabel>
        <h2>Organ transplantation at national scale</h2>
        <p className="section-lede">
          National figures. They do not represent outcomes for an individual
          patient.
        </p>
        <ol className="ed-growth">
          {TRANSPLANT_BARS.map((item, index) => (
            <li key={item.year}>
              <span>{item.year}</span>
              <strong>{item.label}</strong>
              <i
                style={{
                  width: on ? `${Math.max(28, (item.value / max) * 100)}%` : "0%",
                }}
              />
              {index < TRANSPLANT_BARS.length - 1 ? (
                <em aria-hidden="true">→</em>
              ) : null}
            </li>
          ))}
        </ol>
        <p>
          Government data reports annual organ transplantation increasing from
          4,990 transplants in 2013 to 18,911 in 2024, then nearly 20,000 in
          2025.
        </p>
        <SourceCite id="notto-annual-2025-26" />
        <SourceCite id="pib-transplants-2025" />
        <SourceCite id="notto-home" />
      </div>
    </section>
  );
}
