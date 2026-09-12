import Link from "next/link";

export const metadata = { title: "About — Doctor's Credit" };

export default function AboutPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">About</p>
      <h1>Healthcare should be evaluated by value, not just price.</h1>
      <p>
        DCredit is a US-focused medical care coordination platform. We are not a
        hospital. We are not a doctor. We do not independently diagnose, prescribe
        or guarantee medical outcomes.
      </p>
      <p>
        We believe patients deserve clarity, transparency, choice, safety, access
        and honest economics. We don’t believe every patient should travel. We
        believe every patient should understand their options.
      </p>
      <p>
        Founder portraits and a longer origin story will sit here when they are
        ready. The philosophy is already in force: if India is not the better
        option, we will say stay.
      </p>
      <Link className="btn-solid" href="/enroll">
        Start my $5 assessment
      </Link>
    </main>
  );
}
