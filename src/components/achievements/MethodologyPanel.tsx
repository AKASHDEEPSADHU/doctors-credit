"use client";

import { useId, useState } from "react";

export function MethodologyPanel() {
  const panelId = useId();
  const [open, setOpen] = useState(false);

  return (
    <section className="ma-method">
      <div className="shell">
        <button
          type="button"
          className="ma-method-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          How we assembled this page
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        <div id={panelId} hidden={!open} className="ma-method-body">
          <ul>
            <li>Statistics come from identified government, institutional or peer-reviewed sources.</li>
            <li>Institutional and hospital-reported claims are labeled as such.</li>
            <li>National statistics do not establish individual patient suitability.</li>
            <li>DCredit is not the original source of the medical claims on this page.</li>
            <li>Sources may be updated over time as official records change.</li>
            <li>Information is educational and not medical advice, diagnosis or clearance.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
