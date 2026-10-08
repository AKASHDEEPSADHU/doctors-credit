"use client";

import Script from "next/script";
import { useState } from "react";

type CashfreeWindow = Window & {
  Cashfree?: (options: { mode: "sandbox" }) => { checkout: (options: { paymentSessionId: string; redirectTarget: "_self" }) => Promise<unknown> };
};
export default function CashfreeCheckout({ sessionId, statusUrl }: { sessionId: string; statusUrl: string }) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function launch() {
    setBusy(true); setError("");
    try {
      const api = (window as CashfreeWindow).Cashfree;
      if (!api) throw new Error();
      await api({ mode: "sandbox" }).checkout({ paymentSessionId: sessionId, redirectTarget: "_self" });
      setBusy(false);
    } catch { setBusy(false); setError("Test checkout did not open or was closed. Verify your payment status before retrying."); }
  }
  return <>
    <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" onReady={() => setReady(true)} onError={() => setError("Cashfree checkout could not load.")} />
    <button className="btn-solid" disabled={!ready || busy} onClick={launch}>{busy ? "Opening Cashfree…" : "Open Cashfree sandbox checkout"}</button>
    {error ? <p role="alert">{error}</p> : null}
    <p><a href={statusUrl}>Check payment status</a> · <a href="/account">My Account</a></p>
  </>;
}
