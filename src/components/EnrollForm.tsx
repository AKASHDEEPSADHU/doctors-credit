import { GoogleMark } from "@/components/GoogleButton";
import { PACKAGES, type PackageSku } from "@/lib/packages";

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
        <a
          className="btn-google"
          href={`/signin?next=${encodeURIComponent(sku ? `/enroll?sku=${sku}` : "/enroll")}`}
        >
          <GoogleMark />
          Continue with Google
        </a>
        <p className="fine">
          We receive your name and email from Google. Phone and country are
          optional, and only for the path you ask us to walk.
        </p>
      </div>
    );
  }

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
          Phone (optional)
          <input name="phone" type="tel" defaultValue={patient.phone} autoComplete="tel" />
        </label>
        <label>
          Country you are travelling from
          <input
            name="country"
            type="text"
            defaultValue={patient.country}
            autoComplete="country-name"
          />
        </label>
      </div>
      <button className="btn-solid" type="submit">
        Continue to payment
      </button>
      <p className="fine">
        Demo mode marks the order paid immediately. Live Stripe Checkout replaces
        this when keys are present. Hospital invoices are never in this ledger.
      </p>
    </form>
  );
}
