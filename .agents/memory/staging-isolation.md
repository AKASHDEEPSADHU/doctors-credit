---
name: DCREDIT staging isolation
description: User requirements for public sandbox hosting without changing production or exposing development.
---

Use a proper publicly reachable HTTPS staging deployment for Cashfree Sandbox; prefer `https://staging.dcredit.in`. Do not expose the protected development server or bypass Replit Shield.

**Why:** The user confirmed the Replit Shield diagnosis and requested separate public staging rather than an access workaround.

**How to apply:** Preserve Next.js, existing authentication, Cashfree signature verification, and the existing database architecture. Do not change payment logic merely to solve hosting, touch production, alter payment/historical Dodo records, or enable live payments. Explain the deployment choice, database implications and DNS before changing configuration. After public HTTPS reachability is verified, stop for the user's staging review: do not update the Cashfree TEST webhook or initiate a ₹999 payment test in the staging-preparation task.

Use the existing Cloudflare Workers/OpenNext staging path, not Replit Autoscale, for this public staging environment.

**Why:** The user selected Cloudflare staging to preserve the application's native D1 binding architecture instead of changing persistence to accommodate Replit hosting.

**How to apply:** Keep Replit as the protected development workspace. Scope Cloudflare infrastructure, domain and secret configuration to staging; do not select another hosting runtime without a new user decision.

Use an isolated, empty Cloudflare D1 staging database initialized with the existing migrations.

**Why:** The user explicitly required an empty staging database and preservation of production and historical payments.

**How to apply:** Do not copy patient/payment data, clear an existing database, or reuse a populated database for this staging task. Confirm the staging binding differs from production before initializing it.

Cloudflare account membership permissions and delegated MCP write permissions are not interchangeable.

**Why:** Resource GETs and membership inspection succeeded through the managed connection, but both user- and account-token verification endpoints rejected its credential. Account-level administrator rights alone did not expose the delegated token's exact grants.

**How to apply:** Report verified read access separately from account-level rights and unverified integration write access. Do not infer that the connection is broken or request new credentials solely from a token-introspection error when resource reads work. Never test writes during a read-only audit.
