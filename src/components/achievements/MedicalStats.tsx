"use client";

import { useEffect, useRef, useState } from "react";
import { GLANCE_STATS } from "@/lib/india-medical-achievements";
import { SourceCite } from "@/components/achievements/SourceCite";

function formatCount(stat: (typeof GLANCE_STATS)[number], progress: number) {
  if (stat.numeric === null) return stat.display;
  if (stat.id === "abha") {
    return `${(stat.numeric * progress).toFixed(progress === 1 ? 2 : 1)}${stat.suffix}`;
  }
  if (stat.suffix === "%") {
    return `${stat.prefix}${Math.round(stat.numeric * progress)}${stat.suffix}`;
  }
  const value = Math.round(stat.numeric * progress);
  return `${stat.prefix}${value.toLocaleString("en-IN")}${stat.suffix}`;
}

export function MedicalStats() {
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        setProgress(0);
        const start = performance.now();
        const tick = (now: number) => {
          const next = Math.min(1, (now - start) / 1100);
          setProgress(next);
          if (next < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const featured = GLANCE_STATS.find((item) => item.featured)!;
  const rest = GLANCE_STATS.filter((item) => !item.featured);

  return (
    <section className="ma-glance" id="india-at-a-glance">
      <div className="shell" ref={ref}>
        <p className="eyebrow">Scale, with sources</p>
        <h2>India at a glance</h2>
        <p className="section-lede">
          National statistics describe India&apos;s healthcare ecosystem at
          scale. They do not establish the suitability or quality of a specific
          hospital, physician or treatment for an individual patient.
        </p>
        <div className="ma-glance-board">
          <article className="ma-glance-feature">
            <p className="ma-glance-number">{formatCount(featured, progress)}</p>
            <p>{featured.label}</p>
            <SourceCite id={featured.sourceId} />
          </article>
          <ul className="ma-glance-side">
            {rest.map((item, index) => (
              <li key={item.id} style={{ animationDelay: `${120 + index * 90}ms` }}>
                <p className="ma-glance-number">{formatCount(item, progress)}</p>
                <p>{item.label}</p>
                <SourceCite id={item.sourceId} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
