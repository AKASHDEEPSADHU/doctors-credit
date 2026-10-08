# Cashfree Phase 1 operation

The imported Next.js app is the source of truth. New assessment payments use
the Cashfree adapter; historical Dodo/$5 records and processing are preserved.
Production/live assessment checkout is code-disabled while policy approval is
pending. No live endpoint or credential is needed.

## Replit development configuration

Secrets (sandbox only): `CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET`.

Non-secret development variables:

- `CASHFREE_ENVIRONMENT=sandbox`
- `CASHFREE_API_VERSION=2026-01-01`
- `CASHFREE_PUBLIC_ORIGIN=https://a40d14c9-f5f0-4c5f-a832-7177e8026ffb-00-2ke6blg408928.pike.replit.dev`
- `CASHFREE_USD_SANDBOX_VERIFIED=false`

The existing session/Google/Turnstile configuration still applies. Demo Google
is not enabled by the Cashfree implementation. Never use a demo-payment flag
as financial confirmation.

Domestic orders are exactly 999.00 INR. International orders are exactly 15.00
USD, but remain blocked until the owner confirms native USD support on this
sandbox account and enables the server-side capability gate. Never convert
international assessments to INR. Disable customer offers/surcharges or any
currency conversion that changes the fixed charge.

## Dashboard stop point

No webhook is configured by this code or by this implementation task.
**Do not change/delete/reuse the existing NOTIFY_URL, 2023-08-01, success webhook.**
Create Order deliberately omits `notify_url`, so the existing configuration is
not invoked through that parameter.

When the owner authorizes dashboard setup, register a separate custom Payment
Gateway webhook in TEST mode:

`https://a40d14c9-f5f0-4c5f-a832-7177e8026ffb-00-2ke6blg408928.pike.replit.dev/api/webhook/cashfree`

Select version `2026-01-01` and payment success, payment failed, and payment user
dropped events. The handler requires `x-webhook-version`, raw-body HMAC signature
verification, and an independent Cashfree API cross-check. Do not use webhook
inspector sites to forward sensitive payloads.

The origin must remain reachable over public HTTPS while Cashfree sends events.
This development URL is not a production URL. If the development origin changes,
update the configured origin and the new custom webhook—not the protected legacy
NOTIFY_URL. Confirm sandbox checkout accepts the origin; do not submit it as a
live whitelisting request.

## Persistence

`0005_cashfree_assessment.sql` is additive: provider identity on assessment orders
and a payment-attempt ledger. It must follow migrations 0001–0004 on the appropriate
D1 development/staging database before using that database with the new adapter.
The migration was applied to the existing local D1 development database only;
a before/after comparison confirmed unchanged historical application/payment
record values. No remote or production migration was performed.
Development JSON storage needs no SQL migration and preserves legacy objects.

Failed/user-dropped attempts do not close an active provider order. Retry/resume
the same order. Only verified terminal unpaid orders release the assessment lock.
Paid confirmation, duplicate webhook handling and amount/currency mismatches use
the existing assessment repository. Discrepancies require review; refunds are not
automated or promised.

## Verification boundary

Automated tests use simulated Cashfree API responses and synthetic signatures.
They do not prove merchant capability or a real hosted-checkout payment.
Complete domestic and international hosted sandbox tests only after sandbox
credentials and the separately authorized custom webhook are configured.
No Phase 2 features are part of this implementation.

## Changed application files

Paths below are relative to the imported Next.js application:

- Adapter: `src/lib/payment-providers/types.ts`,
  `src/lib/payment-providers/cashfree.ts`, `src/lib/payment-providers/index.ts`.
- Payment domain: `src/lib/assessment-checkout.ts`,
  `src/lib/assessment-verification.ts`, `src/lib/assessment-events.ts`,
  `src/lib/cashfree-webhook.ts`, `src/lib/repo/assessments.ts`.
- Routes: `src/app/api/webhook/cashfree/route.ts`,
  `src/app/api/assessment/verify/route.ts`, `src/app/api/me/route.ts`,
  `src/app/assessment/checkout/page.tsx`.
- Enrollment/return: `src/app/enroll/page.tsx`, `src/app/success/page.tsx`,
  `src/components/AssessmentForm.tsx`, `src/components/CashfreeCheckout.tsx`,
  `src/components/AssessmentPaymentStatus.tsx`.
- Account/privacy: `src/lib/account-view.ts`, `src/components/AccountClient.tsx`,
  `src/app/privacy/page.tsx`.
- Migration/tests: `migrations/0005_cashfree_assessment.sql`,
  `src/lib/cashfree.test.ts`, `src/lib/assessment.test.ts`, `package.json`.
- Development configuration: `.env.example`, `.dev.vars.example`,
  `next.config.ts` (exact proxied development hostname allowed).
- Handoff: `docs/cashfree-phase1.md`.

Existing Dodo SDK/package, webhook and legacy payment repository are retained.
No new SDK package is necessary: server native fetch/HMAC and the Cashfree
browser v3 SDK are used. Only non-secret Cashfree development variables are set
through Replit configuration; sandbox credentials are not supplied by this task.
