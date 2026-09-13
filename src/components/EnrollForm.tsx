import GoogleButton from "@/components/GoogleButton";
import TurnstileField from "@/components/TurnstileField";
import {
  INSURANCE_STATUSES,
  PROCEDURE_CATEGORIES,
  TIMELINES,
  splitName,
} from "@/lib/application-fields";
import { PACKAGES, type PackageSku } from "@/lib/packages";
import { US_STATES } from "@/lib/us-states";

function asSku(v: string | undefined): PackageSku {
  if (v === "direction" || v === "journey" || v === "orientation") return v;
  return "orientation";
}

type PatientLite = {
  name: string;
  email: string;
  phone: string;
  country: string;
};

export default function EnrollForm({
  patient,
  sku,
  error,
}: {
  patient: PatientLite | null;
  sku?: string;
  error?: string;
}) {
  const selected = asSku(sku);
  if (!patient) {
    return (
      <div className="gate">
        {error ? <p className="enroll-error">{error}</p> : null}
        <p className="gate-copy">
          Sign in with Google before any money moves. The account is yours; the
          hospital bill never passes through it.
        </p>
        <GoogleButton
          next={sku ? `/enroll?sku=${sku}` : "/enroll"}
          label="Continue with Google"
        />
        <p className="fine">
          We receive your name and email from Google. The $5 assessment then
          collects only what a coordinator needs to open the conversation — not a
          full medical history.
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
      <fieldset className="enroll-skus">
        <legend>Package</legend>
        {PACKAGES.map((p) => (
          <label key={p.sku}>
            <input type="radio" name="sku" value={p.sku} defaultChecked={p.sku === selected} />
            <span className="enroll-sku-name">{p.name}</span>
            <span className="enroll-sku-price">{p.priceLabel}</span>
          </label>
        ))}
      </fieldset>
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
          Preferred consultation date
          <input name="preferredConsultationDate" type="date" />
        </label>
      </div>
      <TurnstileField />
      <button className="btn-solid" type="submit">
        Continue to $5 payment
      </button>
      <p className="fine">
        Payment is confirmed on our servers before the application is marked paid.
        We do not store card numbers, CVV or banking passwords. Do not send MRI,
        prescriptions or a detailed diagnosis on this form.
      </p>
    </form>
  );
}
