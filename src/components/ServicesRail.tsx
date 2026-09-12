"use client";

import { useState } from "react";

const services = [
  {
    n: "01",
    t: "Plain-language orientation",
    d: "Sit with the sentence that changed the week until it can be spoken without panic. Reports, scans, what has already been tried.",
    o: "You leave knowing what you actually face.",
  },
  {
    n: "02",
    t: "Hyderabad pathway direction",
    d: "An independent reading of which kind of centre in this city is built for this work. Cardiac is not orthopaedics. A brochure is not a map.",
    o: "You walk toward a room that fits the case.",
  },
  {
    n: "03",
    t: "Records a specialist can use",
    d: "History, imaging, medicines, and the sequence of attempts — ordered, dated, and spare.",
    o: "No one asks you to narrate the illness twice.",
  },
  {
    n: "04",
    t: "Reading a quote",
    d: "What is in the number, what is not, and what a surprise bill usually hides. We do not inflate it.",
    o: "You know the difference between a fee and a journey.",
  },
  {
    n: "05",
    t: "Visa, payments, currency",
    d: "India e-Medical and attendant visas. Hospital accounts. Wires. USD or another currency into INR without theatre.",
    o: "The date does not slip for paperwork.",
  },
  {
    n: "06",
    t: "Travel, stay, liaison",
    d: "Who flies with you, where you sleep near the campus, someone on the ground through admission — then a briefing your clinician at home can continue from.",
    o: "You are not a tourist in your own treatment.",
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
