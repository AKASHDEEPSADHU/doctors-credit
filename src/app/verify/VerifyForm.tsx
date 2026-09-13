"use client";

import { useState } from "react";
import TurnstileField from "@/components/TurnstileField";

export default function VerifyForm() {
  const [result, setResult] = useState<"idle" | "ok" | "no">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = new FormData(e.currentTarget);
    const res = await fetch("/api/verify", { method: "POST", body });
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    setResult(data?.ok ? "ok" : "no");
  }

  return (
    <form className="enroll" onSubmit={onSubmit}>
      <label>
        DCredit Call Verification ID
        <input
          name="callId"
          required
          autoComplete="off"
          spellCheck={false}
          placeholder="CALL-7K4P9"
        />
      </label>
      <TurnstileField />
      <button className="btn-solid" type="submit">
        Verify this communication
      </button>
      {result === "ok" ? (
        <p className="welcome" role="status">
          ✓ Verified DCredit Communication
        </p>
      ) : null}
      {result === "no" ? (
        <p className="enroll-error" role="status">
          Unable to verify this communication.
        </p>
      ) : null}
      <p className="fine">
        This page never shows patient names, emails, medical information or case
        notes. If verification fails, hang up and use the contact details on
        dcredit.in.
      </p>
    </form>
  );
}
