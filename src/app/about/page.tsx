import Link from "next/link";

export const metadata = { title: "About | Doctor's Credit" };

export default function AboutPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">About</p>
      <h1>Could India be the right place for the care you are considering?</h1>
      <p>
        DCredit is an international planned-care decision and coordination
        platform. We help people considering planned care across borders
        understand whether India is worth investigating for their particular
        situation. We are not a hospital. We are not a doctor. We are not an
        insurer, an emergency service or a diagnostic service. We do not
        independently diagnose, prescribe, clear patients for travel or
        guarantee medical outcomes.
      </p>
      <p>
        We believe patients deserve clarity, transparency, choice, safety,
        access and honest economics. Cost can open the conversation. It should
        not end it. We do not believe every patient should travel. We believe
        every patient should understand their options.
      </p>
      <p>
        We are building DCredit in stages, starting with the decision itself.
        The current paid service is the $5 Initial Assessment. Founder portraits
        and a longer origin story will sit here when they are ready. The
        philosophy is already in force: if India is not the better option, we
        will say stay.
      </p>
      <p>Sometimes India may make sense. Sometimes it may not.</p>
      <Link className="btn-solid" href="/enroll">
        Talk to a care coordinator
      </Link>
    </main>
  );
}
