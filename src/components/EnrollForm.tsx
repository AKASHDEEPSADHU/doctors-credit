import GoogleButton from "@/components/GoogleButton";
import TurnstileField from "@/components/TurnstileField";
import {
  INSURANCE_STATUSES,
  PROCEDURE_CATEGORIES,
  TIMELINES,
  splitName,
} from "@/lib/application-fields";
import { CURRENT_SKU, currentPackage } from "@/lib/packages";
import { US_STATES } from "@/lib/us-states";

type PatientLite = {
  name: string;
  email: string;
  phone: string;
  country: string;
};

export default function EnrollForm({
  patient,
  error,
}: {
  patient: PatientLite | null;
  sku?: string;
  error?: string;
}) {
  const assessment = currentPackage();
  if (!patient) {
    return (
      <div className="gate">
        {error ? <p className="enroll-error">{error}</p> : null}
        <p className="gate-copy">
          Sign in with Google before any money moves. The $5 Initial Assessment
          is a conversation with DCredit — not a clinical evaluation. The
          hospital bill never passes through this account.
        </p>
        <GoogleButton next="/enroll" label="Continue with Google" />
        <p className="fine">
          We receive your name and email from Google. The form then collects
          only what a coordinator needs to open the conversation — not a full
          medical history. Please do not send medical records, imaging,
          prescriptions or diagnoses.
        </p>
      </div>
    );
  }

  const names = splitName(patient.name);

  return (
    <form className="enroll" action="/api/checkout" method="post">
      {error ? <p className="enroll-error">{error}</p> : null}
      <p className="signed-as">
        Signed in as <strong>{patient.name}</strong>
        <span> · {patient.email}</span>
      </p>
      <input type="hidden" name="sku" value={CURRENT_SKU} />
      <div className="treat-card" style={{ marginBottom: "1.2rem" }}>
        <small>{assessment.priceLabel}</small>
        <h3>{assessment.name}</h3>
        <p className="muted">{assessment.blurb}</p>
      </div>
      <div className="enroll-grid">
        <label>
          First name
          <input name="firstName" required defaultValue={names.firstName} autoComplete="given-name" />
        </label>
        <label>
          Last name
          <input name="lastName" required defaultValue={names.lastName} autoComplete="family-name" />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" required defaultValue={patient.phone} autoComplete="tel" />
        </label>
        <label>
          US state
          <select name="usState" required defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Country
          <input
            name="country"
            type="text"
            required
            defaultValue={patient.country || "United States"}
            autoComplete="country-name"
          />
        </label>
        <label>
          Procedure category
          <select name="procedureCategory" required defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {PROCEDURE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="enroll-span">
          Procedure
          <input
            name="procedure"
            required
            placeholder="e.g. knee replacement"
            autoComplete="off"
          />
        </label>
        <label>
          Insurance status
          <select name="insuranceStatus" required defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {INSURANCE_STATUSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Estimated US out-of-pocket
          <input name="estimatedUsOop" required placeholder="e.g. $8,000 or unknown" />
        </label>
        <label>
          Preferred treatment timeline
          <select name="preferredTimeline" required defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {TIMELINES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Preferred conversation date
          <input name="preferredConsultationDate" type="date" />
        </label>
      </div>
      <TurnstileField />
      <button className="btn-solid" type="submit">
        Continue to $5 Assessment
      </button>
      <p className="fine">
        Payment is confirmed on our servers before the application is marked paid.
        We do not store card numbers, CVV or banking passwords. Please do not send
        MRI scans, prescriptions, diagnoses or other sensitive medical records on
        this form.
      </p>
    </form>
  );
}
