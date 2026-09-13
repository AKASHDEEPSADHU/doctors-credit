import GoogleButton from "@/components/GoogleButton";
import TurnstileField from "@/components/TurnstileField";
import { demoGoogleAllowed, googleConfigured } from "@/lib/google";
import { safeNext } from "@/lib/origin";
import { getSession } from "@/lib/session";
import { getPatientById } from "@/lib/store";
import Link from "next/link";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; demo?: string }>;
}) {
  const q = await searchParams;
  const next = safeNext(q.next);
  const demo = demoGoogleAllowed();
  const live = googleConfigured();
  const session = await getSession();
  const patient = session ? await getPatientById(session.patientId) : null;

  if (patient) {
    return (
      <main id="main" className="signin">
        <p className="eyebrow">My Account</p>
        <h1>You are signed in.</h1>
        <p className="lede">
          Signed in as <strong>{patient.name}</strong> · {patient.email}
        </p>
        <p>
          <Link className="btn-solid" href={next === "/signin" ? "/account" : next}>
            Continue
          </Link>
        </p>
        <form action="/api/logout" method="post">
          <button className="btn-ghost" type="submit">
            Log out
          </button>
        </form>
      </main>
    );
  }
  const errors: Record<string, string> = {
    google_unconfigured:
      "Google Sign-In is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
    google_failed: "Google could not complete sign-in. Try again.",
    bad_state: "That sign-in expired. Start again.",
    missing_code: "Google returned without a code. Start again.",
    demo_disabled: "Demo Google is off because a real Google client is configured.",
    session: "Please sign in again.",
    turnstile: "Please complete the verification check.",
    invalid: "That sign-in was invalid.",
  };
  const message = q.error ? errors[q.error] || "Sign-in did not complete." : "";

  return (
    <main id="main" className="signin">
      <p className="eyebrow">Your file</p>
      <h1>Sign in before any money moves.</h1>
      <p className="lede">
        Google opens your file. The current paid service is the $5 Initial
        Assessment — a conversation with DCredit, not a clinical evaluation.
        The hospital bill never passes through this ledger.
      </p>
      {message ? <p className="enroll-error">{message}</p> : null}
      {live ? (
        <GoogleButton next={next} />
      ) : demo ? (
        <form className="demo-google" action="/api/auth/google/demo" method="post">
          <input type="hidden" name="next" value={next} />
          <p>
            This preview has no Google Cloud client yet. Continue as a labelled
            demo Google account — not a real Google login.
          </p>
          <TurnstileField />
          <button className="btn-solid" type="submit">
            Continue with demo Google
          </button>
        </form>
      ) : (
        <p className="enroll-error">{errors.google_unconfigured}</p>
      )}
    </main>
  );
}
