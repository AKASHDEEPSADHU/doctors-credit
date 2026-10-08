import Link from "next/link";
import GoogleButton from "./GoogleButton";
import TurnstileField from "./TurnstileField";
import { ASSESSMENT_SERVICE, assessmentPrice } from "@/lib/assessment";
import type { Identity } from "@/lib/repo/types";
import type { AssessmentOrder } from "@/lib/repo/assessments";
import { turnstileSiteKey } from "@/lib/turnstile";

export default function AssessmentForm({ patient, order, error, testCheckoutAllowed }: {
  patient: Identity | null; order: AssessmentOrder | null; error?: string; testCheckoutAllowed: boolean;
}) {
  const siteKey = turnstileSiteKey();
  if (!patient) return (
    <section className="gate">
      <h2>Sign in with Google</h2>
      <p>Your patient type and payment state are saved to your account.</p>
      <GoogleButton next="/enroll" label="Sign in with Google" siteKey={siteKey} />
      <p className="fine">We receive your verified email and account identity from Google. This is not a medical-record intake.</p>
    </section>
  );
  const locked = order && order.status !== "FAILED";
  const price = patient.patientType ? assessmentPrice(patient.patientType) : null;
  return (
    <section className="enroll">
      <p className="signed-as">Signed in as <strong>{patient.name}</strong> · {patient.email} · <Link href="/account">My Account</Link></p>
      {error ? <p className="enroll-error" role="alert">{error}</p> : null}
      <form action="/api/patient-type" method="post">
        <fieldset disabled={Boolean(locked)}>
          <legend>Patient type</legend>
          <label><input type="radio" name="patientType" value="DOMESTIC" defaultChecked={patient.patientType === "DOMESTIC"} required /> Domestic Patient — ₹999 INR</label>
          <label><input type="radio" name="patientType" value="INTERNATIONAL" defaultChecked={patient.patientType === "INTERNATIONAL"} required /> International Patient — USD 15</label>
          <button className="btn-ghost" type="submit">Save patient type</button>
        </fieldset>
        {locked ? <p className="fine">Patient type is locked while payment is pending, confirmed or under review.</p> : null}
      </form>
      <div className="care-checkout-card">
        <h2>Initial Patient Assessment</h2>
        <p>Patient Assistance &amp; Medical Coordination Fee</p>
        <p className="care-price">{price?.label || "Select and save your patient type"}</p>
        <p>One-time coordination and assistance fee. After verified payment, DCREDIT begins the coordination process.</p>
        <p>This payment does not constitute medical treatment or medical advice. DCREDIT does not provide diagnosis or treatment.</p>
        <p><strong>Not included:</strong> doctor consultations, hospital charges, diagnostic tests, medicines, surgery/procedures, accommodation, travel, food, local transportation, visas, third-party fees or optional post-assessment support packages.</p>
      </div>
      <div className="enroll-error" role="status">
        <strong>Cancellation/refund policy pending approval.</strong>
        <p>Live payments are disabled. No refund or cancellation promise is being made. The old $5 policy is not applied to this assessment.</p>
      </div>
      {order?.status === "PAID" ? (
        <p className="welcome">Your test payment is confirmed. <Link href="/account">View payment details</Link>. Do not pay again.</p>
      ) : order?.status === "REVIEW_REQUIRED" ? (
        <p role="alert">Your payment needs manual review. Do not pay again. Contact DCREDIT.</p>
      ) : (
        <form action="/api/assessment/checkout" method="post">
          <input type="hidden" name="service" value={ASSESSMENT_SERVICE} />
          {order?.status === "PENDING" ? <p>A test checkout is pending. Continuing reuses the same checkout; it does not create a second order.</p> : null}
          {order?.status === "FAILED" ? <p>The previous payment failed or was declined. You can begin a new test attempt.</p> : null}
          <label><input type="checkbox" name="acknowledgeService" value="yes" required /> I understand this is a coordination and assistance fee, not medical treatment or advice.</label>
          <label><input type="checkbox" name="acknowledgePrivacy" value="yes" required /> I have reviewed the <Link href="/privacy">privacy information</Link> and <Link href="/terms">current platform terms</Link>. Revised assessment payment terms are pending.</label>
          <label><input type="checkbox" name="acknowledgePendingPolicy" value="yes" required /> I understand this is test-only checkout. Cancellation/refund terms are pending and live payment is unavailable.</label>
          {testCheckoutAllowed ? <TurnstileField siteKey={siteKey} /> : null}
          <button className="btn-solid" type="submit" disabled={!price || !testCheckoutAllowed || Boolean(order?.status === "PENDING" && !order.checkoutUrl)}>
            {testCheckoutAllowed ? "Continue to Dodo test checkout" : "Live checkout unavailable — policy pending"}
          </button>
          <p className="fine">Use Dodo test payment details only. A browser return is not proof of payment; confirmation requires a signed server webhook.</p>
        </form>
      )}
    </section>
  );
}
