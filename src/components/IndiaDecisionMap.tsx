import Link from "next/link";

const FACTORS = [
  {
    id: "expertise",
    label: "Clinical expertise",
    layer: "Expertise",
    href: "/treatments",
    text: "Specialist experience and procedure mix matter more than a destination slogan. Explore treatments and research notes.",
  },
  {
    id: "quality",
    label: "Quality & safety",
    layer: "Quality",
    href: "/hospitals",
    text: "Accreditation, safety systems and provider-level evidence help you investigate quality. They are not a guarantee of outcome.",
  },
  {
    id: "technology",
    label: "Advanced technology",
    layer: "Capability",
    href: "/india-medical-achievements",
    text: "Selected tertiary centres use technologies such as robotic surgery and proton therapy. Capability is institution-specific.",
  },
  {
    id: "access",
    label: "Access & timing",
    layer: "Access",
    href: "/how-it-works",
    text: "Availability and wait times can shape whether travel is even worth investigating. See how DCredit frames the decision.",
  },
  {
    id: "value",
    label: "Total value",
    layer: "Total value",
    href: "/cost-calculator",
    text: "Cost sits here, as one part of the picture: care at home, care in India, travel, lodging, time away and follow-up.",
  },
  {
    id: "continuity",
    label: "Continuity of care",
    layer: "Continuity",
    href: "/guide",
    text: "Visas, recovery, companion needs and return-home planning decide whether a journey is workable, not festive.",
  },
] as const;

export function IndiaDecisionMap() {
  return (
    <section className="decision-map" aria-labelledby="decision-map-title">
      <div className="shell">
        <p className="ed-label">Decision map</p>
        <h2 id="decision-map-title">Why India enters the conversation</h2>
        <p className="section-lede">
          India enters the conversation for more than one reason.
        </p>

        <ol className="decision-layers" aria-label="How the decision is framed">
          <li>Quality</li>
          <li>Expertise</li>
          <li>Capability</li>
          <li>Access</li>
          <li>Total value</li>
          <li>Continuity</li>
        </ol>

        <div className="decision-board">
          <p className="decision-hub">
            <span className="decision-hub-kicker">Investigating</span>
            <span className="decision-hub-name">India</span>
            <span className="decision-hub-note">
              A place to evaluate, not a conclusion.
            </span>
          </p>

          <ul className="decision-nodes">
            {FACTORS.map((factor, index) => (
              <li key={factor.id} className={`decision-node decision-node-${index + 1}`}>
                <Link href={factor.href} className="decision-card">
                  <span className="decision-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="decision-layer">{factor.layer}</span>
                  <span className="decision-label">{factor.label}</span>
                  <span className="decision-explain">{factor.text}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="decision-question">
            <span className="decision-question-kicker">The question that remains</span>
            Is India right for you?
          </p>
        </div>
      </div>
    </section>
  );
}
