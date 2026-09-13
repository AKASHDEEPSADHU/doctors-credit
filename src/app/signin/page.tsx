import GoogleButton from "@/components/GoogleButton";
import TurnstileField from "@/components/TurnstileField";
import { demoGoogleAllowed, googleConfigured } from "@/lib/google";
import { safeNext } from "@/lib/origin";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; demo?: string }>;
}) {
  const q = await searchParams;
  const next = safeNext(q.next);
  const demo = demoGoogleAllowed();
  const live = googleConfigured();
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
        Google opens the file. Then you choose a $5 assessment, an India care
        evaluation, or complete coordination. The hospital bill never passes
        through this ledger.
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
