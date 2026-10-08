"use client";

import { useEffect, useState } from "react";

export default function AssessmentPaymentStatus({ orderId }: { orderId: string }) {
  const [message, setMessage] = useState("Checking Cashfree server confirmation…");
  useEffect(() => {
    let stopped = false;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    async function check() {
      try {
        const response = await fetch("/api/assessment/verify", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId }),
        });
        const result = await response.json();
        if (stopped) return;
        if (response.ok && (result.status !== "PENDING" || result.review)) { window.location.reload(); return; }
        setMessage(result.attemptStatus === "FAILED" ? "The last attempt failed. The same order remains pending; do not create another payment."
          : ["USER_DROPPED", "CANCELLED"].includes(result.attemptStatus) ? "The last attempt was cancelled or abandoned. No payment is confirmed; the same order remains pending."
          : result.error || "Payment is still pending confirmation. Do not pay again.");
      } catch { if (!stopped) setMessage("Verification is unavailable. Do not pay again; check My Account later."); }
      if (!stopped && ++tries < 5) timer = setTimeout(check, 5000);
    }
    void check();
    return () => { stopped = true; clearTimeout(timer); };
  }, [orderId]);
  return <p role="status">{message}</p>;
}
