"use client";

import { useId, useState } from "react";
import { INVESTIGATION_QUESTIONS } from "@/lib/india-medical-achievements";

export function QuestionAccordion() {
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(INVESTIGATION_QUESTIONS[0].id);

  return (
    <section className="ma-questions" id="questions-worth-asking">
      <div className="shell">
        <p className="ed-label">What this means</p>
        <h2>What should an international patient actually investigate?</h2>
        <p className="section-lede">
          These questions are the practical next step after reading a national
          record of capability.
        </p>
        <ul className="ma-accordion">
          {INVESTIGATION_QUESTIONS.map((item, index) => {
            const isOpen = open === item.id;
            const panelId = `${baseId}-${item.id}`;
            return (
              <li key={item.id} className={isOpen ? "is-open" : undefined}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                >
                  <span>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    {item.question}
                  </span>
                  <em aria-hidden="true">{isOpen ? "−" : "+"}</em>
                </button>
                <div className="ma-accordion-panel" id={panelId} aria-hidden={!isOpen}>
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
