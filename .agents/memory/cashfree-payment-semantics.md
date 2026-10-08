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
