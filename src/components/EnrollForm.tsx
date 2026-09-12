"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PACKAGES, type PackageSku } from "@/lib/packages";

function asSku(v: string | null): PackageSku {
  if (v === "direction" || v === "journey" || v === "orientation") return v;
  return "orientation";
}

export default function EnrollForm() {
  const params = useSearchParams();
  const [sku, setSku] = useState<PackageSku>(asSku(params.get("sku")));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const selected = PACKAGES.find((p) => p.sku === sku)!;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          country: form.get("country"),
          sku,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start enrollment.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="enroll" id="enroll-form">
      <div className="enroll-skus" role="radiogroup" aria-label="Choose a beginning">
        {PACKAGES.map((p) => (
          <button
            key={p.sku}
            type="button"
            role="radio"
            aria-checked={sku === p.sku}
            className={sku === p.sku ? "on" : ""}
            onClick={() => setSku(p.sku)}
          >
            <span className="enroll-sku-name">{p.name}</span>
            <span className="enroll-sku-price">{p.priceLabel}</span>
          </button>
        ))}
      </div>
      <p className="enroll-blurb">{selected.blurb}</p>
      <div className="enroll-grid">
        <label>
          Full name
          <input name="name" required autoComplete="name" placeholder="As on your passport" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
        </label>
        <label>
          Phone / WhatsApp
          <input name="phone" required autoComplete="tel" placeholder="+1 …" />
        </label>
        <label>
          Country you live in
          <input name="country" required autoComplete="country-name" placeholder="United States" />
        </label>
      </div>
      {error ? <p className="enroll-error">{error}</p> : null}
      <button className="btn-gold" type="submit" disabled={busy}>
        {busy ? "Opening the door…" : `Continue · ${selected.priceLabel}`}
      </button>
      <p className="fine">
        Orientation is five dollars so the first conversation is real, not a funnel.
        Hospital bills are never charged through this form. We do not diagnose. We
        do not take hospital commissions.
      </p>
    </form>
  );
}
