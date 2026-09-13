"use client";

import { useState } from "react";

const services = [
  {
    n: "01",
    t: "A clear first conversation",
    d: "The $5 Initial Assessment is a conversation with DCredit about the care you are considering, your healthcare coverage or funding, timeline and goals, not a diagnosis.",
    o: "You leave knowing whether exploring India may make sense.",
  },
  {
    n: "02",
    t: "Questions that matter",
    d: "We help organize what you may later need to gather. V1 does not include a medical-record vault or document upload.",
    o: "You know what to ask next, not what to upload today.",
  },
  {
    n: "03",
    t: "Real economics",
    d: "Expected costs at home versus a broader India journey, when enough information is available. Savings are never guaranteed.",
    o: "You compare the total journey, not sticker prices.",
  },
  {
    n: "04",
    t: "Practical considerations",
    d: "Travel, timing, recovery and why return-home planning matters. Detailed coordination is a future service.",
    o: "You see the decision, not a brochure.",
  },
  {
    n: "05",
    t: "No pressure to proceed",
    d: "There is no obligation to travel or to purchase a later service after the $5 Initial Assessment.",
    o: "The decision remains yours.",
  },
  {
    n: "06",
    t: "Later phases, when ready",
    d: "Future DCredit services may include deeper provider coordination and travel or care support. We will not describe those as live until they are.",
    o: "We build in stages, starting with the decision itself.",
  },
];

export default function ServicesRail() {
  const [on, setOn] = useState(0);
  const active = services[on];
  return (
    <div className="services-rail">
      <ol>
        {services.map((s, i) => (
          <li key={s.n}>
            <button
              type="button"
              className={i === on ? "is-on" : undefined}
              onMouseEnter={() => setOn(i)}
              onFocus={() => setOn(i)}
              onClick={() => setOn(i)}
            >
              <span>{s.n}</span>
              <strong>{s.t}</strong>
            </button>
          </li>
        ))}
      </ol>
      <aside>
        <p className="eyebrow">What this does for you</p>
        <h3>{active.t}</h3>
        <p>{active.d}</p>
        <p className="outcome">{active.o}</p>
      </aside>
    </div>
  );
}
