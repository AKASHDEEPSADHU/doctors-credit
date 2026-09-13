# Doctor's Credit (DCredit.in)

US→India planned-care navigation. **Not** the household-finance DCREDIT PWA, and **not** a hospital, physician, lender or emergency service.

Production target: [https://dcredit.in](https://dcredit.in) (`www` 301s to the apex). Hosting is **Cloudflare Workers**. Vercel is not used.

## Architecture (V1)

```
GitHub → Cloudflare Worker (website + API)
              ├── Turnstile
              ├── D1     durable operational records (IDs, payment state, audit)
              ├── Google Sheets   staff CRM replica (not medical records)
              ├── Dodo Payments $5 assessment (webhook is authoritative)
              └── Resend (optional) transactional email
```

The browser never talks to Google Sheets, Dodo secrets, or Cloudflare credentials. `ApplicationRepository` is the only persistence API. Today the Worker writes D1 first (so a paid application cannot vanish if Sheets is down), then projects the same **non-clinical** columns into Google Sheets. A later D1-primary / Sheets-off cutover does not require a frontend rewrite.

R2 private document storage is **not** implemented. Do not upload MRI/CT/X-ray files, prescriptions or detailed diagnoses until a dedicated privacy/compliance review is done. Do not claim HIPAA compliance.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Local `next dev` uses `data/development-store.json` unless a D1 binding is available. It will not write a production spreadsheet: set `GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID` to the live CRM id and keep `APP_ENV=development`.

```bash
npm test
npm run preview   # Workers runtime via OpenNext + Wrangler
```

## Cloudflare production (cost-controlled)

Workers + D1 + Turnstile + DNS/SSL stay on Cloudflare’s free tier for validation-stage traffic. Do not add paid products (R2 cache, Workers Paid, extra KV) until the limit is actually hit.

1. Create GitHub repo `AKASHDEEPSADHU/doctors-credit` and push this tree. Do **not** copy it into DCREDIT-Egnt.
2. `npx wrangler login` on the Cloudflare account that will own `dcredit.in`.
3. Create databases and paste the IDs into `wrangler.jsonc`:

```bash
npx wrangler d1 create dcredit-staging
npx wrangler d1 create dcredit-production
npx wrangler d1 migrations apply dcredit-staging --env staging
npx wrangler d1 migrations apply dcredit-production --env production
```

4. Secrets (never commit these):

```bash
npx wrangler secret put SESSION_SECRET --env production
npx wrangler secret put TURNSTILE_SECRET_KEY --env production
npx wrangler secret put GOOGLE_CLIENT_ID --env production
npx wrangler secret put GOOGLE_CLIENT_SECRET --env production
npx wrangler secret put DODO_PAYMENTS_API_KEY --env production
npx wrangler secret put DODO_PAYMENTS_WEBHOOK_KEY --env production
# Non-secret vars: DODO_PAYMENTS_ENVIRONMENT, DODO_PAYMENTS_RETURN_URL, DODO_PRODUCT_ID_ORIENTATION
npx wrangler secret put GOOGLE_SHEETS_SPREADSHEET_ID --env production
npx wrangler secret put GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID --env production
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON --env production
npx wrangler secret put STAFF_API_SECRET --env production
# optional
npx wrangler secret put RESEND_API_KEY --env production
```

   Public Turnstile site key and WhatsApp number are Wrangler `vars` / `.dev.vars`, not secrets.

5. Google Sheet **DCredit Patient Applications**: private, not published, not embedded. Import `crm/patient-applications.headers.csv`. Share only with coordinators and the service account. Columns match the CRM replica; they are operational, not a healthcare database.

6. Dodo webhook URL: `https://dcredit.in/api/webhook/dodo`. Subscribe to `payment.succeeded`. Success in the browser is never enough to mark PAID.

7. Google OAuth redirect: `https://dcredit.in/api/auth/google/callback`.

8. Deploy:

```bash
npm run deploy:staging
npm run deploy:production
```

9. In Cloudflare DNS, point `dcredit.in` at this Worker. Create a Redirect Rule so `https://www.dcredit.in/*` 301s to `https://dcredit.in/$1`. **This replaces the current finance PWA on that hostname.**

Workers custom domains require the zone on the same account. If DNS is still at another registrar, create the zone or CNAME as Cloudflare documents.

## Application IDs

After Dodo (or the non-production demo path) confirms payment, the patient sees:

- Application ID `DC-000001`
- Conversation Verification ID `CV-7K4P9`

The Conversation Verification ID is not a password, OTP, PIN or CVV. Coordinators verify it before discussing a case. Patients can confirm a live call at `/verify` using a short-lived `CALL-…` id issued from `/staff`.

## Environments

| Env | Persistence | Google Sheet |
| --- | --- | --- |
| development | JSON file or local D1 | development spreadsheet only |
| staging | D1 `dcredit-staging` | staging spreadsheet |
| production | D1 `dcredit-production` | production spreadsheet |

Demo payments and demo Google sign-in are development-only. They cannot be enabled in staging or production, including via `ALLOW_DEMO_PAYMENTS`.

Replace the placeholder D1 `database_id` values in `wrangler.jsonc` before any live deploy. The all-zero IDs are not production databases.
