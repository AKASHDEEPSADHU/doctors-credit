"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GoogleButton from "@/components/GoogleButton";
import type { AccountView } from "@/lib/account-view";

function StatusValue({ children }: { children: string }) {
  return <p className="account-status-value">{children}</p>;
}

function ConversationBlock({
  appointment,
}: {
  appointment: NonNullable<NonNullable<AccountView["assessment"]>["appointment"]> | null;
}) {
  if (!appointment) {
    return (
      <div className="account-field">
        <p className="account-label">Conversation</p>
        <p>No conversation time selected yet</p>
      </div>
    );
  }
  return (
    <div className="account-field">
      <p className="account-label">Conversation</p>
      <div className="account-appt">
        <p>{appointment.dateLabel}</p>
        <p>{appointment.timeLabel}</p>
        <p>{appointment.timezoneLabel}</p>
      </div>
    </div>
  );
}

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
        <h1>Sign in with Google to open your account.</h1>
        <p className="lede">
          This page shows your care conversation, selected conversation time,
          and Zoom join details after payment is confirmed. It is not a medical
          record.
        </p>
        <GoogleButton next="/account" label="Continue with Google" />
        <p className="fine">
          No conversation yet? <Link href="/enroll">Talk to a care coordinator</Link>
        </p>
      </div>
    );
  }

  const assessment = data.assessment;
  const paid = assessment?.paymentStatus === "PAID";
  const zoomUrl = paid ? assessment?.meeting?.joinUrl : undefined;
  const statusLabel = !assessment
    ? "Assessment not yet started"
    : assessment.paymentLabel;

  return (
    <div className="account">
      {params.get("signedIn") || params.get("welcome") ? (
        <p className="welcome">
          You are signed in. This account is for your DCredit assessment, not a
          medical record.
        </p>
      ) : null}

      <header className="account-head">
        <div>
          <p className="eyebrow">My Account</p>
          <h1>{data.patient.name}</h1>
          <p className="account-email">{data.patient.email}</p>
        </div>
        <form action="/api/logout" method="post">
          <button className="account-logout" type="submit">
            Log out
          </button>
        </form>
      </header>

      <section className="account-card account-card-primary" aria-labelledby="assessment-heading">
        <h2 id="assessment-heading" className="account-card-title">
          Your care conversation
        </h2>

        <div className="account-field">
          <p className="account-label">Status</p>
          <StatusValue>{statusLabel}</StatusValue>
        </div>

        <ConversationBlock appointment={assessment?.appointment ?? null} />

        {paid && zoomUrl ? (
          <div className="account-field">
            <p className="account-label">Your Zoom conversation</p>
            <a className="btn-solid account-join" href={zoomUrl}>
              Join Zoom
            </a>
            <p className="account-hint">
              Please join a few minutes before your scheduled time.
            </p>
          </div>
        ) : null}

        {paid && !zoomUrl ? (
          <p className="account-pending">
            Payment received. We&apos;re finalizing your conversation details.
            Your appointment information will appear here once confirmed.
          </p>
        ) : null}

        {!paid ? (
          <>
            <Link className="btn-solid account-cta" href="/enroll">
              Talk to a care coordinator
            </Link>
            <p className="account-hint">
              Choose a convenient time for your conversation and continue when
              you are ready.
            </p>
          </>
        ) : null}
      </section>

      {paid && assessment?.applicationId ? (
        <section className="account-card" aria-labelledby="ids-heading">
          <h2 id="ids-heading" className="account-card-title">
            Application information
          </h2>
          <dl className="account-meta">
            <div>
              <dt>Application ID</dt>
              <dd>{assessment.applicationId}</dd>
            </div>
            {assessment.conversationVerificationId ? (
              <div>
                <dt>Conversation Verification ID</dt>
                <dd>{assessment.conversationVerificationId}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      <section className="account-card" aria-labelledby="details-heading">
        <h2 id="details-heading" className="account-card-title">
          Account details
        </h2>
        <dl className="account-meta">
          <div>
            <dt>Name</dt>
            <dd>{data.patient.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{data.patient.email}</dd>
          </div>
        </dl>
      </section>

      <aside className="account-note" aria-labelledby="account-note-heading">
        <p id="account-note-heading" className="account-label">
          Important
        </p>
        <p>
          This conversation is with a DCredit care coordinator. It is not a
          medical diagnosis or clinical evaluation.
        </p>
        <p>Clinical invoices from hospitals never appear here.</p>
      </aside>
    </div>
  );
}
