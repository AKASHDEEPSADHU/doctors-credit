import Link from "next/link";

export const metadata = { title: "Medical travel guide — Doctor's Credit" };

export default function GuidePage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Guide</p>
      <h1>How to think about medical travel without the brochure language.</h1>
      <p>
        Compare your real US exposure. Ask what an India price includes. Plan the
        flight home as a clinical event. Keep records together. Do not treat
        accreditation as an outcome. Do not travel for emergencies.
      </p>
      <p>
        <Link href="/research">Research and sources</Link> ·{" "}
        <Link href="/faq">FAQ</Link> ·{" "}
        <Link href="/cost-calculator">Cost calculator</Link>
      </p>
    </main>
  );
}
