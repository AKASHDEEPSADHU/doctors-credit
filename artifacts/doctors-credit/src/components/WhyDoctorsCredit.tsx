"use client";

import { useEffect, useRef, useState } from "react";
import { WHY_DOCTORS_CREDIT, type WhyQuestion } from "@/lib/why-doctors-credit";

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: WhyQuestion;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const wasOpen = useRef(isOpen);
  const [closing, setClosing] = useState(false);
  const buttonId = `why-dc-trigger-${item.number}`;
  const panelId = `why-dc-panel-${item.number}`;

  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setClosing(true);
      const timeout = window.setTimeout(() => setClosing(false), reduce ? 0 : 300);
      wasOpen.current = isOpen;
      return () => window.clearTimeout(timeout);
    }
    wasOpen.current = isOpen;
    if (isOpen) setClosing(false);
  }, [isOpen]);

  return (
    <div
      className={`why-dc-item${isOpen ? " is-open" : ""}${closing ? " is-closing" : ""}`}
    >
      <h3 className="why-dc-heading">
        <button
          type="button"
          id={buttonId}
          className="why-dc-trigger"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="why-dc-num" aria-hidden="true">
            {item.number}
          </span>
          <span className="why-dc-q">{item.question}</span>
          <span className="why-dc-chevron" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3.2 5.6 8 10.4l4.8-4.8"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        className={`why-dc-panel${isOpen ? " is-open" : ""}`}
      >
        <div className="why-dc-panel-clip">
          <div className="why-dc-panel-inner">
            {item.answer.map((paragraph, index) => (
              <p key={`${item.number}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WhyDoctorsCredit() {
  const [active, setActive] = useState<string | null>(WHY_DOCTORS_CREDIT[0].number);

  return (
    <section className="why-dc" id="why-doctors-credit" aria-labelledby="why-dc-title">
      <div className="shell why-dc-shell">
        <header className="why-dc-header">
          <p className="eyebrow">Questions worth answering</p>
          <h2 id="why-dc-title">
            Why opt for
            <br />
            Doctor’s Credit?
          </h2>
          <p className="why-dc-lede">
            Choosing a financial partner is an important decision.
            Here are some of the questions worth asking before you make it.
          </p>
        </header>

        <div className="why-dc-main">
          <div className="why-dc-list">
            {WHY_DOCTORS_CREDIT.map((item) => (
              <AccordionItem
                key={item.number}
                item={item}
                isOpen={active === item.number}
                onToggle={() =>
                  setActive((current) => (current === item.number ? null : item.number))
                }
              />
            ))}
          </div>

          <div className="why-dc-cta">
            <p className="why-dc-cta-kicker">Still have a question?</p>
            <p className="why-dc-cta-title">Let’s talk about your requirement.</p>
            <a className="btn-solid why-dc-cta-btn" href="/enroll">
              Talk to a care coordinator
            </a>
            <p className="why-dc-cta-note">
              No pressure. Just a conversation to understand what may be possible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
