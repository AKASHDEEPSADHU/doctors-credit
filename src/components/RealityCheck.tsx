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
      <p className="tag">Reality Check: informational only</p>
      <h3>Is exploring planned care in India worth discussing?</h3>
      <p className="source">
        This tool is an informational screening aid, not a medical assessment,
        diagnosis or clearance.
      </p>
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
          Could you travel internationally if a clinician later agreed?
          <select value={travel} onChange={(e) => setTravel(e.target.value)}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label>
          Do you have medical records you could later share through an appropriate process?
          <select value={records} onChange={(e) => setRecords(e.target.value)}>
            <option value="yes">Yes</option>
            <option value="partial">Some</option>
            <option value="no">Not yet</option>
          </select>
        </label>
        <label>
          Estimated cost you may pay at home ($)
          <input type="number" min={0} value={oop} onChange={(e) => setOop(+e.target.value)} />
        </label>
      </fieldset>
      <button className="btn-solid" type="submit">
        See if India may be worth exploring
      </button>
      {tone === "GREEN" ? (
        <p className="verdict">
          India may be worth exploring. Based on the information provided, this
          pathway may deserve further evaluation. Speak with your own
          healthcare professionals before making a treatment decision.
        </p>
      ) : null}
      {tone === "YELLOW" ? (
        <p className="verdict">
          More information is needed before making a decision. India may still
          be worth discussing, but this tool cannot tell you whether it is the
          better option.
        </p>
      ) : null}
      {tone === "RED" ? (
        <p className="verdict">
          {urgency === "emergency"
            ? "DCredit does not handle emergencies. If you are in the United States, call 911. Otherwise seek immediate local care."
            : "Based on the information provided, this pathway may not be the better option to explore right now. Speak with your own healthcare professionals before making a treatment decision."}
        </p>
      ) : null}
      <p className="source">
        This is not a diagnosis, travel clearance, medical suitability
        determination or treatment recommendation. It does not replace a
        physician.
      </p>
    </form>
  );
}
