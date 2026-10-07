import Link from "next/link";

export const metadata = { title: "Medical travel guide | Doctor's Credit" };

export default function GuidePage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Guide</p>
      <h1>How to think about medical travel without the brochure language.</h1>
      <p>
        Planned care abroad is not a holiday. The practical side of the
        decision includes visas, travel, accommodation, companion arrangements,
        recovery time, local logistics, communication and return-home planning.
        A treatment price is only one part of a medical journey.
      </p>
      <h2>Before anyone books a flight</h2>
      <p>
        Compare expected healthcare costs at home with the complete India
        journey. Ask what a quoted treatment price includes. Confirm visa
        category with the concerned Indian mission. Plan lodging and companion
        costs as part of the same picture, not as an afterthought.
      </p>
      <h2>The journey does not end when treatment ends</h2>
      <p>
        Discharge information, medications, imaging, follow-up, travel fitness
        and communication with healthcare professionals at home all belong in
        the plan. A qualified clinician, not a website, must clear someone to
        fly. DCredit does not itself provide clinical follow-up.
      </p>
      <p>
        This guide is informational. It is not medical advice, diagnosis or
        clearance. DCredit does not currently offer a medical-record vault or
        generate a return-home packet. Do not treat accreditation as an
        outcome. Do not travel for emergencies.
      </p>
      <p>
        <Link href="/research">Research and sources</Link> ·{" "}
        <Link href="/faq">FAQ</Link> ·{" "}
        <Link href="/cost-calculator">Cost calculator</Link>
      </p>
      <p>
        <Link className="btn-solid" href="/enroll">
          Talk to a care coordinator
        </Link>
      </p>
    </main>
  );
}
