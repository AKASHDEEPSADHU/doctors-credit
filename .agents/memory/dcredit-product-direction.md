---
name: DCREDIT product direction
description: The user's stated target product direction for the DCREDIT website.
---

DCREDIT's target is a ₹999 medical-tourism coordination platform, replacing the $5 Initial Care Conversation website.

**Why:** the user stated this as the target for architecture planning.

**How to apply:** Align future DCREDIT architecture planning with this target.

Phase 1 uses ₹999 INR for domestic patients and USD 15 for international patients. The Initial Patient Assessment is a coordination and assistance fee, not doctor consultation or treatment.

**Why:** the user specified these prices and the service boundary.

**How to apply:** Keep the saved account classification as the pricing basis. Do not imply that hospital, treatment, travel or third-party costs are included.

Live paid checkout must remain disabled until the user supplies and approves revised cancellation/refund terms. Show a clearly pending policy state. Do not reuse or automatically modify the old $5 refund wording. Do not proceed beyond Phase 1.

**Why:** the user explicitly instructed this before implementation.

**How to apply:** Sandbox development and testing may continue, but policy approval must precede live payment activation. Preserve historical $5 terms and transactions independently.

Dodo denied DCREDIT payment-service onboarding. Do not request Dodo credentials or continue Dodo sandbox testing. Cashfree is the provider the user is permitted/approved to use for DCREDIT. Use Cashfree for new Phase 1 assessment payments through a clean provider abstraction, without a broad payment-system rewrite. Do not implement Stripe or Whop, or change application code, schema or payment records merely to accommodate a payment-connector limitation.

**Why:** the user explicitly changed the provider after Dodo's onboarding denial and reiterated that connector availability must not change the provider choice or drive application/data changes.

**How to apply:** Preserve all historical Dodo/$5 transactions and their legacy handling. Use only sandbox credentials for new testing; never request or enable live Cashfree credentials/payments. Confirm that the user's Cashfree merchant account supports exactly USD 15 before enabling the international test flow; otherwise stop that flow and report the limitation, without converting it to INR.
