import Link from "next/link";

export const metadata = { title: "Medical travel guide — Doctor's Credit" };

export default function GuidePage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Guide</p>
      <h1>How to think about medical travel without the brochure language.</h1>
      <p>
        Compare your real US exposure. Ask what an India price includes. Plan
        the flight home as a clinical event that a qualified clinician — not a
        website — must clear. Keep records together if you later proceed. Do not
        treat accreditation as an outcome. Do not travel for emergencies.
      </p>
      <p>
        This guide is informational. It is not medical advice, diagnosis or
        clearance. DCredit does not currently offer a medical-record vault or
        generate a return-home packet.
      </p>
      <p>
        <Link href="/research">Research and sources</Link> ·{" "}
        <Link href="/faq">FAQ</Link> ·{" "}
        <Link href="/cost-calculator">Cost calculator</Link>
      </p>
    </main>
  );
}
