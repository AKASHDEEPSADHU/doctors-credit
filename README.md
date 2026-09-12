# Doctor's Credit

Independent Hyderabad care-direction site. **This is not DCREDIT, the household finance app.** It lives in its own git history so that product is untouched.

Live domain (when you point DNS): `dcredit.in`

## What it is

A premium lead site for patients in the US, Canada, Europe, New Zealand, and Australia. Honest frame: **no hospital tie-ups, no commissions.** Orientation is **$5** and opens a patient file (orders + payments). WhatsApp sits on every page from first load.

## Before first deploy

1. Put your WhatsApp in E.164 without `+` as `NEXT_PUBLIC_WHATSAPP_E164` (example `9198XXXXXXXX`). The corner button is on from the first page load.
2. Drop founder portraits into `public/founders/akashdeep.jpg` and `public/founders/partner.jpg`, and set her name in `src/lib/contact.ts`.
3. Set `SESSION_SECRET`. For real charges, add Stripe keys and set `DEMO_PAYMENTS=false`. Use a [restricted key](https://docs.stripe.com/keys/restricted-api-keys.md) (`rk_`) rather than `sk_live_`. Webhook: `/api/webhook/stripe`.

## Local

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_WHATSAPP_E164
npm install
npm run dev
```

With `DEMO_PAYMENTS=true` (default when Stripe is unset), Orientation creates the account without a card so you can see `/account`.

## GitHub

This environment cannot create a repository under your account (the integration token is scoped to DCREDIT). Create an empty repo `doctors-credit` on GitHub, then:

```bash
cd /path/to/doctors-credit
git remote add origin https://github.com/AKASHDEEPSADHU/doctors-credit.git
git push -u origin main
```

Do not copy these files into the DCREDIT-Egnt repo.
