"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GoogleButton from "@/components/GoogleButton";
import type { AccountView } from "@/lib/account-view";

export default function AccountClient() {
  const params = useSearchParams();
  const [data, setData] = useState<AccountView | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch("/api/me");
      if (cancelled) return;
      if (res.ok) {
        setData(await res.json());
        setMissing(false);
      } else {
        setMissing(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data && !missing) {
    return <p className="account-muted">Opening your account…</p>;
  }

  if (missing || !data) {
    return (
      <div className="account-gate">
        <p className="eyebrow">My Account</p>
        <h1>Sign in with Google to open your assessment.</h1>
        <p className="lede">
          This page shows your $5 Initial Assessment, selected conversation time,
          and Zoom join details after payment is confirmed. It is not a medical
          record.
        </p>
        <GoogleButton next="/account" label="Continue with Google" />
        <p className="fine">
          No assessment yet? <Link href="/enroll">Start my $5 Assessment</Link>
        </p>
      </div>
    );
  }

  const assessment = data.assessment;
  const paid = assessment?.paymentStatus === "PAID";

  return (
    <div className="account">
      {params.get("signedIn") || params.get("welcome") ? (
        <p className="welcome">You are signed in. This account is for your DCredit assessment, not a medical record.</p>
      ) : null}
      <header className="account-head">
        <div>
          <p className="eyebrow">My Account</p>
          <h1>{data.patient.name}</h1>
          <p className="account-muted">{data.patient.email}</p>
        </div>
        <form action="/api/logout" method="post">
          <button className="btn-ghost" type="submit">
            Log out
          </button>
        </form>
      </header>

      <section className="assessment-panel">
        <h2>Your assessment</h2>
        {!assessment ? (
          <>
            <p>Status: Assessment not yet started</p>
            <p>
              <Link className="btn-solid" href="/enroll">
                Continue to $5 Assessment
              </Link>
            </p>
          </>
        ) : (
          <>
            <p>
              <span className="tag">Status</span>
              <strong>{assessment.paymentLabel}</strong>
            </p>
            {assessment.appointment ? (
              <div className="appointment-block">
                <p className="tag">Conversation</p>
                <p>
                  {assessment.appointment.dateLabel}
                  <br />
                  {assessment.appointment.timeLabel} {assessment.appointment.timezoneLabel}
                </p>
              </div>
            ) : (
              <p className="account-muted">No conversation time selected yet.</p>
            )}
            {paid && assessment.meeting?.joinUrl ? (
              <p>
                <span className="tag">Zoom</span>
                <a href={assessment.meeting.joinUrl}>Join conversation</a>
              </p>
            ) : paid ? (
              <p>Payment received. We&apos;re finalizing your conversation details. Your appointment information will appear here once confirmed.</p>
            ) : null}
            {paid && assessment.applicationId ? (
              <div className="codes">
                <div>
                  <span className="tag">Application ID</span>
                  <strong>{assessment.applicationId}</strong>
                </div>
                <div>
                  <span className="tag">Conversation Verification ID</span>
                  <strong>{assessment.conversationVerificationId}</strong>
                </div>
              </div>
            ) : (
              <p>
                <Link className="btn-solid" href="/enroll">
                  Continue to $5 Assessment
                </Link>
              </p>
            )}
          </>
        )}
      </section>

      <p className="fine">
        This conversation is with a DCredit care coordinator. It is not a medical
        diagnosis or clinical evaluation. Clinical invoices from hospitals never
        appear here.
      </p>
    </div>
  );
}
