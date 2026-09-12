"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GoogleButton from "@/components/GoogleButton";

type Ledger = {
  patient: {
    name: string;
    email: string;
    phone: string;
    country: string;
    createdAt: string;
  };
  orders: {
    id: string;
    title: string;
    sku: string;
    amountCents: number;
    currency: string;
    status: string;
    createdAt: string;
  }[];
  payments: {
    id: string;
    orderId: string;
    amountCents: number;
    currency: string;
    createdAt: string;
  }[];
};

function money(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default function AccountClient() {
  const params = useSearchParams();
  const [data, setData] = useState<Ledger | null>(null);
  const [missing, setMissing] = useState(false);

  async function load() {
    const res = await fetch("/api/me");
    if (res.ok) {
      setData(await res.json());
      setMissing(false);
    } else {
      setMissing(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    setData(null);
    setMissing(true);
  }

  if (!data && !missing) {
    return <p className="account-muted">Opening your file…</p>;
  }

  if (missing || !data) {
    return (
      <div className="account-gate">
        <p className="eyebrow">Your file</p>
        <h1>Sign in with Google to open it.</h1>
        <p className="lede">
          After Orientation, this is where payments and orders live. The same
          Google account you used before any money moved.
        </p>
        <GoogleButton next="/account" label="Continue with Google" />
        <p className="fine">
          No file yet? <Link href="/enroll">Begin Orientation — $5</Link>
        </p>
      </div>
    );
  }

  const unpaid = data.orders.filter((o) => o.status === "paid").length === 0;

  return (
    <div className="account">
      {params.get("welcome") ? (
        <p className="welcome">
          You are in. This is your Doctor&apos;s Credit file — quiet, private,
          and only about the path you asked us to walk.
        </p>
      ) : null}
      <header className="account-head">
        <div>
          <p className="eyebrow">Patient file</p>
          <h1>{data.patient.name}</h1>
          <p className="account-muted">
            {data.patient.email}
            {data.patient.phone ? ` · ${data.patient.phone}` : ""}
            {data.patient.country ? ` · ${data.patient.country}` : ""}
          </p>
        </div>
        <button className="btn-ghost" type="button" onClick={logout}>
          Sign out
        </button>
      </header>

      {unpaid ? (
        <p className="fine">
          Signed in, not yet begun. <Link href="/enroll">Continue to Orientation — $5</Link>
        </p>
      ) : null}

      <section>
        <h2>Orders</h2>
        {data.orders.length === 0 ? (
          <p className="account-muted">No orders yet.</p>
        ) : (
          <ul className="ledger">
            {data.orders.map((o) => (
              <li key={o.id}>
                <div>
                  <strong>{o.title}</strong>
                  <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <em>{o.status}</em>
                  <span>{money(o.amountCents, o.currency)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Payments</h2>
        {data.payments.length === 0 ? (
          <p className="account-muted">No payments recorded yet.</p>
        ) : (
          <ul className="ledger">
            {data.payments.map((p) => (
              <li key={p.id}>
                <div>
                  <strong>Received</strong>
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span>{money(p.amountCents, p.currency)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="fine">
        Clinical invoices from Hyderabad hospitals never appear here. Those are
        paid to the hospital. This ledger is only Doctor&apos;s Credit
        coordination.
      </p>
    </div>
  );
}
