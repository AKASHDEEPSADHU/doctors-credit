"use client";

import { useEffect, useRef, useState } from "react";
import { TRANSPLANT_BARS } from "@/lib/india-medical-achievements";
import { SourceCite } from "@/components/achievements/SourceCite";

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
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const max = Math.max(...TRANSPLANT_BARS.map((item) => item.value));

  return (
    <section className="ma-transplant" id="transplantation" ref={ref}>
      <div className="shell">
        <p className="eyebrow">National scale</p>
        <h2>Organ transplantation at national scale</h2>
        <p className="section-lede">
          These are national transplant figures. They do not represent outcomes
          for individual patients.
        </p>
        <ul className="ma-bars">
          {TRANSPLANT_BARS.map((item) => (
            <li key={item.year}>
              <span>{item.year}</span>
              <div>
                <i
                  style={{
                    width: on ? `${Math.max(18, (item.value / max) * 100)}%` : "0%",
                  }}
                />
              </div>
              <strong>{item.label}</strong>
            </li>
          ))}
        </ul>
        <p>
          Government data reports annual organ transplantation increasing from
          4,990 transplants in 2013 to 18,911 in 2024. Deceased-donor
          transplants rose from 837 to 3,403 over the same period. A February
          2026 Government of India update reported that annual transplantation
          reached nearly 20,000 in 2025.
        </p>
        <SourceCite id="notto-annual-2025-26" />
        <SourceCite id="pib-transplants-2025" />
        <p>
          The National Organ and Tissue Transplant Organization, together with
          regional and state organizations, provides a national framework for
          organ procurement, allocation and transplantation.
        </p>
        <SourceCite id="notto-home" />
      </div>
    </section>
  );
}
