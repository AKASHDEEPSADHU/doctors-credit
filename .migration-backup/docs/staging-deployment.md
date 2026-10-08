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
The staging `DB` binding has been set to the isolated `dcredit-staging` database,
and the existing migrations have been applied. The setup steps below are
reference instructions, not instructions to recreate or reset that database.

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

### Local preparation versus remote configuration

The staging profile is prepared locally with public `workers.dev` and preview
URLs disabled and `routes: []`. The preferred hostname is not attached; the
`CASHFREE_PUBLIC_ORIGIN` value is only a configuration string, not DNS or routing.
Do not add a custom-domain route until domain attachment is explicitly approved.

The profile explicitly declares:

- `DB`: isolated `dcredit-staging` D1, ID
  `559e4c25-35c7-4c43-bd20-023722c53440`.
- `ASSETS`: `.open-next/assets`, using the existing OpenNext build output.
- `WORKER_SELF_REFERENCE`: `dcredit-staging`, never production.
- `secrets.required`: the six staging credential names listed below. Names are
  validation declarations only; no values or encrypted bindings are installed.

Cloudflare runtime bindings and assets belong to a Worker version. The empty,
undeployed management record has no version on which to configure them. Local
preparation does not attach D1, upload assets, configure remote variables or
install secrets. Do not substitute preview-template bindings for runtime
bindings, create dummy code, or use auto-deploying commands to bootstrap it.

First-version preparation requires separate approval and an explicit,
non-deploying upload/creation flow for the actual Next.js/OpenNext application.
Private staging credential entry must be planned with that flow: Wrangler
validates declared required secrets during version upload, so a credential-free
upload must not be assumed to pass. Publication remains a separate approval.

Non-secret staging variables are defined under `env.staging.vars`:

| Variable | Value |
| --- | --- |
| `APP_ENV` | `staging` |
| `DEMO_PAYMENTS` | `false` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAAAAFRp7EEi8lzZ2lI0` (public staging widget key) |
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
- `GOOGLE_CLIENT_ID`: staging OAuth client identifier.
- `GOOGLE_CLIENT_SECRET`: staging OAuth client secret.
- `TURNSTILE_SECRET_KEY`: staging widget secret.

Replit Secrets are not automatically copied to Cloudflare. An authorized operator
must enter staging credentials privately. Never paste values in chat or MCP
execution code, and never extract them from the running development process.

**No-publishing boundary:** ordinary `wrangler secret put` deploys a Worker
version immediately; the dashboard's **Deploy** action also publishes changes.
Do not use those actions while publishing remains unapproved. Once an existing
staging Worker/version prerequisite is satisfied, use an interactive
`pnpm exec wrangler versions secret put <NAME> --env staging` prompt to prepare
an unpublished version. This does not install secrets on a serving deployment.
Do not run `versions deploy` or attach public routes until separately approved.

If the staging Worker does not exist, obtain approval for an unpublished
Worker/version setup rather than allowing a command to create and deploy a
placeholder automatically. Replit's secure-input form only stores Replit
Secrets; it is not a Cloudflare secret-transfer mechanism.

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

### Public key and private operator input

The staging build command explicitly supplies the public site key from the
table above to Next.js. The same public key is declared in staging runtime
variables. Keep these values in sync if the staging widget is replaced.
These are local preparations, not evidence that a build or remote
configuration has occurred. No private secret belongs in either location.

For `TURNSTILE_SECRET_KEY`, an authorized operator opens Cloudflare >
Turnstile > **DCREDIT Staging** and obtains its secret privately. Confirm the
widget's public site key matches the value above; do not use the production
widget's secret.

The other five secrets are:

- `SESSION_SECRET`: newly generated exclusively for staging.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: staging OAuth client with
  `https://staging.dcredit.in/api/auth/google/callback` authorized.
- `CASHFREE_CLIENT_ID` and `CASHFREE_CLIENT_SECRET`: Cashfree TEST environment only.

An operator may prepare the JSON file on their own trusted private Linux/macOS
workstation, outside the repository, using hidden terminal prompts. Do not run
this through Agent/MCP tools or a recorded/shared terminal. The input file is
temporarily plaintext, protected by a private directory and file permissions;
Cloudflare encrypts the bindings when a separately approved upload occurs.

The following is an operator-only procedure, not an Agent-executed command:

```sh
python3 - <<'PY'
import getpass
import json
import os
import secrets
import tempfile
import warnings

# Abort instead of falling back to visible input when echo cannot be disabled.
warnings.simplefilter("error", getpass.GetPassWarning)
values = {"SESSION_SECRET": secrets.token_hex(32)}
for name in (
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "TURNSTILE_SECRET_KEY",
    "CASHFREE_CLIENT_ID",
    "CASHFREE_CLIENT_SECRET",
):
    value = getpass.getpass(name + ": ")
    if not value or value != value.strip():
        raise SystemExit("Input missing or contains surrounding whitespace; no file written.")
    values[name] = value

directory = tempfile.mkdtemp(prefix="dcredit-staging-secrets-", dir="/tmp")
os.chmod(directory, 0o700)
path = os.path.join(directory, "secrets.json")
fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "w") as output:
    json.dump(values, output)
print("Private secret-file path:", path)
PY
```

Only the path is printed, never values. Do not `cat` the file, send it to Agent,
attach it, commit it, or include values in shell arguments or logs. The private
operator supplies only this path through `--secrets-file` when version upload
is separately approved. Remove the file and its temporary directory afterward
(or immediately if the upload is abandoned); never fall back to deploying.
Do not create the file or enter credentials through Agent during preparation.

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
