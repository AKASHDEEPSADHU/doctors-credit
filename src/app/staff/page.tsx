import StaffClient from "@/app/staff/StaffClient";
import { staffAuthenticated, staffConfigured } from "@/lib/staff-session";

export const metadata = {
  title: "Coordinator desk — DCredit",
  robots: { index: false, follow: false },
};

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const q = await searchParams;
  const signedIn = await staffAuthenticated();
  const errors: Record<string, string> = {
    unconfigured: "STAFF_API_SECRET is not set for this environment.",
    invalid: "That sign-in was invalid.",
    turnstile: "Complete the verification check.",
    auth: "Staff secret did not match.",
  };
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Internal</p>
      <h1>Coordinator desk</h1>
      <p>
        Search patients by Application ID only. Never discuss a case until the
        Conversation Verification ID matches. This desk does not store medical
        records. V1 staff authentication uses a shared operational credential.
      </p>
      {!staffConfigured() ? (
        <p className="enroll-error">Staff access is not configured in this environment.</p>
      ) : (
        <StaffClient signedIn={signedIn} error={q.error ? errors[q.error] || q.error : undefined} />
      )}
    </main>
  );
}
