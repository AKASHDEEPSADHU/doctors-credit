"use client";

import { useState } from "react";

type Tone = "GREEN" | "YELLOW" | "RED" | null;

export default function RealityCheck() {
  const [elective, setElective] = useState("yes");
  const [travel, setTravel] = useState("yes");
  const [records, setRecords] = useState("yes");
  const [oop, setOop] = useState(8000);
  const [urgency, setUrgency] = useState("planned");
  const [tone, setTone] = useState<Tone>(null);

  function run(e: React.FormEvent) {
    e.preventDefault();
    if (urgency === "emergency") {
      setTone("RED");
      return;
    }
    if (elective !== "yes" || travel !== "yes") {
      setTone("RED");
      return;
    }
    if (records !== "yes" || oop < 4000) {
      setTone("YELLOW");
      return;
    }
    setTone("GREEN");
  }

  return (
    <form className="assess" onSubmit={run}>
      <p className="tag">Decision support — not a diagnosis</p>
      <h3>Should you consider treatment in India?</h3>
      <fieldset>
        <label>
          Is the treatment elective / planned?
          <select value={elective} onChange={(e) => setElective(e.target.value)}>
            <option value="yes">Yes</option>
            <option value="no">No / uncertain</option>
          </select>
        </label>
        <label>
          How quickly is care needed?
          <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option value="planned">I can plan</option>
            <option value="soon">Soon, but not an emergency</option>
            <option value="emergency">This is an emergency</option>
          </select>
        </label>
        <label>
          Can you travel internationally if a clinician agrees?
          <select value={travel} onChange={(e) => setTravel(e.target.value)}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label>
          Do you have medical records to share?
          <select value={records} onChange={(e) => setRecords(e.target.value)}>
            <option value="yes">Yes</option>
            <option value="partial">Some</option>
            <option value="no">Not yet</option>
          </select>
        </label>
        <label>
          Estimated US out-of-pocket ($)
          <input type="number" min={0} value={oop} onChange={(e) => setOop(+e.target.value)} />
        </label>
      </fieldset>
      <button className="btn-solid" type="submit">
        See if India makes sense for me
      </button>
      {tone === "GREEN" ? (
        <p className="verdict">India appears financially and logistically attractive — subject to clinical review.</p>
      ) : null}
      {tone === "YELLOW" ? (
        <p className="verdict">
          India may offer savings, but additional information is needed before we can assess suitability.
        </p>
      ) : null}
      {tone === "RED" ? (
        <p className="verdict">
          {urgency === "emergency"
            ? "DCredit does not handle emergencies. If you are in the US, call 911 or seek immediate local care."
            : "Based on the information provided, India may not be the better option right now."}
        </p>
      ) : null}
      <p className="source">
        This is a decision-support classification, not a medical diagnosis or a
        savings guarantee.
      </p>
    </form>
  );
}
