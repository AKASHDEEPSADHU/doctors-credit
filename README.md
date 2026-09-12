# Doctor's Credit

Independent Hyderabad care-direction site. **This is not DCREDIT, the household finance app.** It lives in its own git history so that product is untouched.

Live domain (when you point DNS): `dcredit.in`

## What it is

A premium lead site for patients in the US, Canada, Europe, New Zealand, and Australia. Honest frame: **no hospital tie-ups, no commissions.** You **sign in with Google before any package is paid.** Orientation is **$5** and opens a patient file (orders + payments). WhatsApp sits on every page from first load.

Visual system: Nizami maroon `#5C1F2E`, gold `#B8935A`, ivory `#F3EDE1`, walnut `#4A342A`.

## Before first deploy

1. Put your WhatsApp in E.164 without `+` as `NEXT_PUBLIC_WHATSAPP_E164`.
2. Create a Google Cloud **Web** OAuth client. Authorized redirect: `{origin}/api/auth/google/callback` (local example `http://127.0.0.1:3100/api/auth/google/callback`). Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Consent screen app name: Doctor's Credit — do not reuse DCREDIT's client.
3. Drop founder portraits into `public/founders/akashdeep.jpg` and `public/founders/partner.jpg`, and set her name in `src/lib/contact.ts`.
4. Set `SESSION_SECRET`. For real charges, add Stripe keys and set `DEMO_PAYMENTS=false`. Use a [restricted key](https://docs.stripe.com/keys/restricted-api-keys.md). Webhook: `/api/webhook/stripe`.

Until Google credentials are set, `DEMO_PAYMENTS=true` shows a labelled **demo Google** continue (not a real Google login).

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

## GitHub

Create an empty repo `doctors-credit` on GitHub, then:

```bash
cd /path/to/doctors-credit
git remote add origin https://github.com/AKASHDEEPSADHU/doctors-credit.git
git push -u origin main
```

Do not copy these files into the DCREDIT-Egnt repo.
