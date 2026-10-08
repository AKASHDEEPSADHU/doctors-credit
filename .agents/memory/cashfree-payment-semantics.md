---
name: Cashfree payment semantics
description: Non-obvious Cashfree order/attempt and documentation constraints for the Phase 1 handoff.
---

Treat a Cashfree payment attempt separately from its order. A failed or user-dropped attempt must not automatically terminate the DCREDIT assessment order or unlock a second checkout.

**Why:** Cashfree permits multiple attempts, each with a different `cf_payment_id`, under one `order_id` until one succeeds. Releasing the assessment lock on an attempt failure could allow two chargeable orders for the same account.

**How to apply:** Record attempt outcomes idempotently, retain the existing active assessment while the provider order remains active, and confirm payment only after authoritative success and exact amount/currency verification. Reconcile provider terminal-order status before allowing a replacement.

Pin and test Cashfree API and webhook versions explicitly; do not copy mode/version defaults from unrelated SDK examples.

**Why:** the official latest API reference and hosted-checkout guide displayed different version examples during the handoff research; some SDK examples also initialized production mode.

**How to apply:** Refresh the official documentation before implementation, choose consistent supported versions, and explicitly use sandbox endpoints and browser SDK mode. Never copy production defaults into Phase 1.

Sources: https://www.cashfree.com/docs/api-reference/payments/latest/webhooks/idempotency and https://www.cashfree.com/docs/payments/online/web/redirect

Keep Cashfree payment references as lossless strings, including when an API response encodes them as numeric JSON tokens.

**Why:** payment references can exceed JavaScript's safe-integer range; normal number parsing followed by string conversion can corrupt reconciliation and duplicate detection.

**How to apply:** Preserve original numeric tokens before storing references. Reject unsafe already-parsed numbers rather than treating rounded values as authoritative identifiers.

Inspect credential existence using secret-only metadata or explicitly filtered booleans, never a full environment-settings response.

**Why:** credential-named entries can be stored as ordinary environment variables; the settings tool then returns their values unmasked even when the user calls them Secrets.

**How to apply:** Request secret-only metadata first. If checking ordinary settings is necessary, output presence flags only and never dump values or the full response. Use the protected Secrets flow to correct misclassified credential entries.

Do not assume browser-style globals are available in the impure network-probe sandbox simply because `fetch` is available.

**Why:** a webhook reachability probe failed with `AbortSignal is not defined`; this sandbox does not expose the complete browser/Node global set.

**How to apply:** Use documented runtime capabilities and a tool with timeout support for bounded HTTP probes.

Cashfree Payment Gateway's dashboard Test action is a synthetic URL-responsiveness check, not an order/payment event. An empty payment-webhook delivery log alone does not prove whether that check sent a request.

**Why:** Cashfree's public merchant dashboard sends a synthetic `test_object` to its own test service, while its documentation says actual payment notifications follow payment events. Treating "No webhooks found" as proof of a routing or signature failure would be premature.

**How to apply:** Compare the saved endpoint URL and the Test action's returned status/subcode with sanitized server arrival logs. Do not fabricate a paid event or relax authentication to make the URL check pass.
