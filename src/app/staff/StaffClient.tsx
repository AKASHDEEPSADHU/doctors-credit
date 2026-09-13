"use client";

import { useState } from "react";
import TurnstileField from "@/components/TurnstileField";

type Found = {
  applicationId: string;
  conversationVerificationId: string;
  firstName: string;
  lastName: string;
  paymentStatus: string;
  applicationStatus: string;
  assignedCoordinator: string;
  preferredConsultationDate: string;
  procedureCategory: string;
  procedure: string;
  notes: string;
};

const QUEUES = [
  "NEW APPLICATIONS",
  "CONSULTATIONS TODAY",
  "PAYMENTS",
  "CASES IN REVIEW",
  "SPECIALIST REVIEW",
  "TREATMENT PROPOSALS",
  "TRAVEL PLANNING",
  "TREATMENT IN INDIA",
  "RETURN-HOME FOLLOW-UP",
  "VERIFICATION REQUESTS",
];

export default function StaffClient({ signedIn, error }: { signedIn: boolean; error?: string }) {
  const [found, setFound] = useState<Found | null>(null);
  const [callId, setCallId] = useState("");
  const [message, setMessage] = useState(error || "");

  async function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    const applicationId = String(new FormData(e.currentTarget).get("applicationId") || "");
    const res = await fetch("/api/staff/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setFound(null);
      setMessage(data?.error || "Not found.");
      return;
    }
    setFound(data);
  }

  async function issueCall() {
    const res = await fetch("/api/staff/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: found?.applicationId }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) setCallId(data.callId);
    else setMessage(data?.error || "Could not issue a call ID.");
  }

  if (!signedIn) {
    return (
      <form className="enroll" action="/api/staff/login" method="post">
        <label>
          Staff secret
          <input name="secret" type="password" required autoComplete="current-password" />
        </label>
        <TurnstileField />
        <button className="btn-solid" type="submit">
          Open coordinator desk
        </button>
        {message ? <p className="enroll-error">{message}</p> : null}
      </form>
    );
  }

  return (
    <div className="staff">
      <form className="enroll" onSubmit={search}>
        <label>
          Search by Application ID
          <input name="applicationId" required placeholder="DC-000001" autoComplete="off" />
        </label>
        <button className="btn-solid" type="submit">
          Open case
        </button>
      </form>
      {message ? <p className="enroll-error">{message}</p> : null}
      {found ? (
        <section className="enroll">
          <p className="eyebrow">{found.applicationStatus}</p>
          <h2>
            {found.applicationId} · {found.firstName} {found.lastName.slice(0, 1)}.
          </h2>
          <p>
            Conversation Verification ID: <strong>{found.conversationVerificationId}</strong>
          </p>
          <p className="fine">
            {found.procedureCategory} · {found.procedure} · payment {found.paymentStatus}
            {found.preferredConsultationDate ? ` · consult ${found.preferredConsultationDate}` : ""}
          </p>
          <h3>Outbound call script</h3>
          <blockquote>
            Hello, this is {found.assignedCoordinator || "[Name]"} calling from DCredit. Before we
            discuss your application, for your security, may I have your DCredit Conversation
            Verification ID?
          </blockquote>
          <h3>If the patient calls</h3>
          <p>Ask for the Application ID and the Conversation Verification ID. Verify both.</p>
          <h3>If verification fails</h3>
          <blockquote>
            For your security, we cannot discuss application details until we can verify the case.
            Please contact us using the official contact information listed on dcredit.in.
          </blockquote>
          <button className="btn-ghost" type="button" onClick={issueCall}>
            Issue Call Verification ID
          </button>
          {callId ? (
            <p>
              Give the patient: <strong>{callId}</strong> — they can confirm it at /verify. It expires
              in two hours and reveals no medical information.
            </p>
          ) : null}
        </section>
      ) : null}
      <section>
        <h2>Queues</h2>
        <ul className="ledger">
          {QUEUES.map((q) => (
            <li key={q}>
              <strong>{q}</strong>
              <span>Architecture ready — cases appear here as status changes.</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
