# DCREDIT Phase 1 — isolated Cloudflare staging

## Scope and status

This prepares the existing Next.js/OpenNext application for a **published**
Cloudflare Worker, not an exposed Next.js development server. Replit Shield
remains unchanged. This document does not assert that staging has been published.

Target Worker: `dcredit-staging`.
Preferred public origin: `https://staging.dcredit.in`.
Eventual Cashfree TEST webhook: `https://staging.dcredit.in/api/webhook/cashfree`.

No production Worker, production route, existing database, historical Dodo/$5
record, payment logic, signature verification, or refund policy is changed.
Do not start a ₹999 payment test or change Cashfree webhook settings in this step.

## Account and database prerequisites

Use the Cloudflare account that controls the `dcredit.in` zone.
The staging `DB` binding still has a deliberately unusable placeholder ID.
Do not deploy until an isolated staging database has been identified or created.

1. Check whether `dcredit-staging` already exists. Do not delete, overwrite or
   reset an existing database. Confirm its purpose and emptiness before reusing
   it. If it contains patient/payment data, stop for approval of a different empty
   staging database; do not reuse or clear those records.
2. If absent, create an empty D1 database named `dcredit-staging`.
3. Replace **only** `env.staging.d1_databases[0].database_id` in
   `wrangler.jsonc` with that database's ID.
4. Confirm it is different from the production database ID.
5. Initialize only the approved staging database using the existing migrations.
   Do not copy development or production patient/payment data.

Operator commands below run from `.migration-backup/`. They are not automatic
steps and must not be run against production:

```sh
pnpm exec wrangler d1 list
# Only if the staging database does not already exist:
pnpm exec wrangler d1 create dcredit-staging
# After confirming and setting the staging-only binding:
pnpm exec wrangler d1 migrations apply dcredit-staging --env staging --remote
```

## Staging settings and secrets

Non-secret staging variables are defined under `env.staging.vars`:

| Variable | Value |
| --- | --- |
| `APP_ENV` | `staging` |
| `DEMO_PAYMENTS` | `false` |
| `DODO_PAYMENTS_ENVIRONMENT` | `test_mode` (legacy code only) |
| `CASHFREE_ENVIRONMENT` | `sandbox` |
| `CASHFREE_API_VERSION` | `2026-01-01` |
| `CASHFREE_PUBLIC_ORIGIN` | `https://staging.dcredit.in` |
| `CASHFREE_USD_SANDBOX_VERIFIED` | `false` |

Store these in the **staging Worker's encrypted Secrets**, never in source,
Wrangler `vars`, command arguments, logs, or this document:

- `CASHFREE_CLIENT_ID`: Cashfree TEST credential only.
- `CASHFREE_CLIENT_SECRET`: Cashfree TEST credential only.
- `SESSION_SECRET`: a strong, staging-specific secret satisfying existing checks.

Replit Secrets are not automatically copied to Cloudflare. An authorized operator
must configure the staging secrets securely through Cloudflare or an interactive
`wrangler secret put <NAME> --env staging` prompt. Never paste values in chat.

For functional patient sign-in, configure the existing Google OAuth and Turnstile
settings for the staging hostname, using staging settings and secrets. Do not
enable demo authentication or remove CAPTCHA requirements to compensate for
missing configuration. Do not copy production Sheets, staff, email or Dodo
payment credentials merely to bring up staging.

Authentication configuration:

- `SESSION_SECRET`: unique to staging, at least 32 characters.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: staging OAuth client, with
  `https://staging.dcredit.in/api/auth/google/callback` registered.
- `TURNSTILE_SECRET_KEY`: staging widget secret.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: staging widget's public key, available to the
  final Next.js build as well as staging runtime; allow `staging.dcredit.in`.

Use separate staging OAuth/widget configuration rather than modifying production
clients or weakening existing checks. Keep all secret values out of source.

## Build and operator publishing

```sh
pnpm run build:staging
```

This selects the staging Wrangler environment during the OpenNext build.
After account, database, secrets and domain prerequisites are satisfied, an
authorized operator can publish with:

```sh
pnpm run deploy:staging
```

Do not run the unqualified `deploy` or `deploy:production` scripts for this task.
The Agent does not publish automatically.

The existing compiled-build checkout guard remains unchanged. A public staging
deployment does **not** activate assessment checkout, live charges, or authorize
a payment test. Sandbox checkout in a compiled build is a separate future review.

## DNS and HTTPS

The zone already uses Cloudflare DNS. The staging custom-domain route is confined
to `staging.dcredit.in`; Cloudflare provisions its record and certificate when an
authorized operator attaches the route. Leave `dcredit.in`, `www.dcredit.in`,
nameservers and production routes untouched.

A published `workers.dev` address can be a stable fallback, but use the actual URL
returned by Cloudflare rather than inventing an account subdomain. If adopting
that fallback as the public origin, update the staging-only
`CASHFREE_PUBLIC_ORIGIN` to the confirmed URL before subsequent checkout work.

## Public reachability acceptance

After publishing and certificate activation:

1. Verify public DNS and TLS, not only workspace/internal DNS.
2. Confirm the staging page loads without a Replit Shield or platform access
   challenge. Do not strip application authentication from protected routes.
3. POST `{}` to `/api/webhook/cashfree` without credentials or a signature.
   Expected: **401 Invalid signature**, with a matching sanitized application
   trace. A 503 configuration response is not sufficient acceptance.
4. Confirm there is no redirect to Replit Shield, login gateway or production.
5. This unsigned rejection proves routing and rejection only; it does not prove
   Cashfree signed delivery. Do not create a fake successful payment.
6. Stop and report the confirmed public URL for the owner's review. Do not update
   the Cashfree TEST webhook or run its Test action as part of staging preparation.
   Those actions require the owner's approval after reviewing staging.

The old `NOTIFY_URL` webhook remains untouched. Do not create another webhook.
