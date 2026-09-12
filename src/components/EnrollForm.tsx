import { PACKAGES, type PackageSku } from "@/lib/packages";

function asSku(v: string | undefined): PackageSku {
  if (v === "direction" || v === "journey" || v === "orientation") return v;
  return "orientation";
}

export default function EnrollForm({
  error,
  sku,
}: {
  error?: string;
  sku?: string;
}) {
  const selected = asSku(sku);
  return (
    <form className="enroll" action="/api/checkout" method="post">
      {error ? <p className="enroll-error">{error}</p> : null}
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
          Full name
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Phone (with country code)
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label>
          Country you are travelling from
          <input name="country" type="text" autoComplete="country-name" />
        </label>
      </div>
      <button className="btn-gold" type="submit">
        Continue
      </button>
      <p className="fine">
        Demo mode marks the order paid immediately. Live Stripe Checkout replaces this as soon as
        keys are present. Email login on the account page is a stopgap until magic links.
      </p>
    </form>
  );
}
