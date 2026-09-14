"use client";

import { useEffect, useState } from "react";
import { SERVICE_FEEDBACK_SLIDES } from "@/lib/patient-stories";

export function FeedbackSlider({
  variant = "panel",
}: {
  variant?: "float" | "panel";
}) {
  const slides = SERVICE_FEEDBACK_SLIDES;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const go = (next: number) => {
    setIndex((next + slides.length) % slides.length);
  };

  return (
    <aside
      className={`ed-slider ed-slider-${variant}`}
      aria-roledescription="carousel"
      aria-label="How DCredit shares stories and advice"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <figure className="ed-slider-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={slide.src + slide.position}
          src={slide.src}
          alt="Editorial portrait used to illustrate DCredit story publication. Not a DCredit patient."
          style={{ objectPosition: slide.position }}
        />
        <figcaption className="ed-slider-copy" aria-live="polite">
          <p className="ed-slider-label">{slide.label}</p>
          <blockquote>{slide.quote}</blockquote>
          <p>{slide.detail}</p>
        </figcaption>
      </figure>
      <div className="ed-slider-nav">
        <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)}>
          ←
        </button>
        <ol>
          {slides.map((item, itemIndex) => (
            <li key={item.label + item.quote}>
              <button
                type="button"
                aria-label={`Show ${item.label}`}
                aria-current={itemIndex === index}
                className={itemIndex === index ? "is-active" : undefined}
                onClick={() => go(itemIndex)}
              />
            </li>
          ))}
        </ol>
        <button type="button" aria-label="Next slide" onClick={() => go(index + 1)}>
          →
        </button>
      </div>
    </aside>
  );
}
