---
name: DCREDIT staging isolation
description: User requirements for public sandbox hosting without changing production or exposing development.
---

Use a proper publicly reachable HTTPS staging deployment for Cashfree Sandbox; prefer `https://staging.dcredit.in`. Do not expose the protected development server or bypass Replit Shield.

**Why:** The user confirmed the Replit Shield diagnosis and requested separate public staging rather than an access workaround.

**How to apply:** Preserve Next.js, existing authentication, Cashfree signature verification, and the existing database architecture. Do not change payment logic merely to solve hosting, touch production, alter payment/historical Dodo records, or enable live payments. Explain the deployment choice, database implications and DNS before changing configuration. Confirm public endpoint reachability before changing the Cashfree TEST webhook. Staging preparation does not authorize a ₹999 payment test.
