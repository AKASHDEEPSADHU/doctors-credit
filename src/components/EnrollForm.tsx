"use client";

import { useEffect, useRef, useState } from "react";
import { PACKAGES, type PackageSku } from "@/lib/packages";

const DRAFT_KEY = "dc-enroll-draft";

type Draft = {
  sku: PackageSku;
  name: string;
  email: string;
  phone: string;
  country: string;
};

function asSku(v: string | null | undefined): PackageSku {
  if (v === "direction" || v === "journey" || v === "orientation") return v;
  return "orientation";
}

function readDraft(): Draft {
  const draft: Draft = { sku: "orientation", name: "", email: "", phone: "", country: "" };
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) Object.assign(draft, JSON.parse(raw) as Draft);
    draft.sku = asSku(draft.sku);
  } catch {
    /* ignore */
  }
  return draft;
}

function persist(form: HTMLFormElement) {
  const fd = new FormData(form);
  const draft: Draft = {
    sku: asSku(String(fd.get("sku") || "")),
    name: String(fd.get("name") || ""),
    email: String(fd.get("email") || ""),
    phone: String(fd.get("phone") || ""),
    country: String(fd.get("country") || ""),
  };
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function applyDraft(form: HTMLFormElement, draft: Draft) {
  const set = (name: keyof Draft, value: string) => {
    const el = form.elements.namedItem(name);
    if (el && "value" in el) el.value = value;
  };
  set("name", draft.name);
  set("email", draft.email);
  set("phone", draft.phone);
  set("country", draft.country);
  const radio = form.querySelector<HTMLInputElement>(`input[name="sku"][value="${draft.sku}"]`);
  if (radio) radio.checked = true;
}

export default function EnrollForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const err = params.get("enrollError");
    if (err) setError(err);
    const draft = readDraft();
    if (params.get("sku")) draft.sku = asSku(params.get("sku"));
    applyDraft(form, draft);

    const save = () => persist(form);
    const blockEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.stopPropagation();
    };
    form.addEventListener("input", save);
    form.addEventListener("change", save);
    form.addEventListener("keydown", blockEscape);
    return () => {
      form.removeEventListener("input", save);
      form.removeEventListener("change", save);
      form.removeEventListener("keydown", blockEscape);
    };
  }, []);

  return (
    <form
      ref={formRef}
      className="enroll"
      action="/api/checkout"
      method="post"
      autoComplete="off"
    >
      {error ? <p className="enroll-error">{error}</p> : null}
      <fieldset className="enroll-skus">
        <legend>Package</legend>
        {PACKAGES.map((p) => (
          <label key={p.sku}>
            <input type="radio" name="sku" value={p.sku} defaultChecked={p.sku === "orientation"} />
            <span className="enroll-sku-name">{p.name}</span>
            <span className="enroll-sku-price">{p.priceLabel}</span>
          </label>
        ))}
      </fieldset>
      <div className="enroll-grid">
        <label>
          Full name
          <input name="name" type="text" required autoComplete="off" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="off" />
        </label>
        <label>
          Phone (with country code)
          <input name="phone" type="tel" autoComplete="off" />
        </label>
        <label>
          Country you are travelling from
          <input name="country" type="text" autoComplete="off" />
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
