"use client";

import { useState } from "react";
import TurnstileField from "@/components/TurnstileField";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = new FormData(form);
    const res = await fetch("/api/contact", { method: "POST", body });
    if (res.ok) {
      setStatus("ok");
      setMessage("Message received. We will reply using the official DCredit contact details.");
      form.reset();
    } else {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus("err");
      setMessage(data?.error || "We could not accept that message. Try email instead.");
    }
  }

  return (
    <form className="enroll" onSubmit={onSubmit}>
      <label>
        Name
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        How can we help?
        <textarea name="message" required rows={5} maxLength={2000} />
      </label>
      <TurnstileField />
      <button className="btn-solid" type="submit">
        Send
      </button>
      {status !== "idle" ? <p className={status === "ok" ? "fine" : "enroll-error"}>{message}</p> : null}
      <p className="fine">
        Do not include medical records, imaging, prescriptions or a detailed
        diagnosis in this form.
      </p>
    </form>
  );
}
