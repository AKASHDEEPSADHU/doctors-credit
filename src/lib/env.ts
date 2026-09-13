export type AppEnv = "development" | "staging" | "production";

const DEV_SESSION_FALLBACK = "dev-only-change-me-doctors-credit";
const MIN_SESSION_SECRET = 32;
const MIN_STAFF_SECRET = 24;

export function appEnv(): AppEnv {
  const raw = (process.env.APP_ENV || process.env.NEXTJS_ENV || "").toLowerCase();
  if (raw === "production" || raw === "staging" || raw === "development") return raw;
  return "development";
}

export function isProduction() {
  return appEnv() === "production";
}

export function isStaging() {
  return appEnv() === "staging";
}

/** Staging and production are live deployments. Development is local only. */
export function isDeployed() {
  return appEnv() === "production" || appEnv() === "staging";
}

/**
 * Secure cookies when APP_ENV is staging/production, or when Node itself
 * is production. Do not key this only on NODE_ENV.
 */
export function secureCookiesEnabled() {
  return isDeployed() || process.env.NODE_ENV === "production";
}

/**
 * Demo payments are development-only.
 * Production condition: always false when APP_ENV=production (and also staging).
 * ALLOW_DEMO_PAYMENTS is ignored.
 */
export function demoPayments() {
  if (isDeployed()) return false;
  return process.env.DEMO_PAYMENTS === "true" || !process.env.STRIPE_SECRET_KEY;
}

export function demoGoogleAllowed() {
  if (isDeployed()) return false;
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) return false;
  return process.env.DEMO_PAYMENTS === "true";
}

export function turnstileRequired() {
  return isDeployed() || Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export function sheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  );
}

/** Local/staging must never write the production CRM spreadsheet. */
export function sheetsWriteAllowed() {
  if (!sheetsConfigured()) return false;
  const productionId = process.env.GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID || "";
  const activeId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";
  if (productionId && activeId === productionId && appEnv() !== "production") {
    return false;
  }
  return true;
}

export function stripeLiveConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

function tooWeak(value: string | undefined, min: number, banned?: string) {
  if (!value || value.length < min) return true;
  if (banned && value === banned) return true;
  return false;
}

/**
 * SESSION_SECRET: required in staging/production. No hardcoded production fallback.
 * Development may use a documented local-only fallback so `next dev` can start.
 */
export function sessionSecretBytes() {
  const raw = process.env.SESSION_SECRET;
  if (isDeployed()) {
    if (tooWeak(raw, MIN_SESSION_SECRET, DEV_SESSION_FALLBACK)) {
      throw new Error("Server configuration is incomplete.");
    }
    return new TextEncoder().encode(raw as string);
  }
  if (!raw) return new TextEncoder().encode(DEV_SESSION_FALLBACK);
  return new TextEncoder().encode(raw);
}

export function staffSecretBytes() {
  const raw = process.env.STAFF_API_SECRET;
  if (!raw) return null;
  if (isDeployed() && tooWeak(raw, MIN_STAFF_SECRET)) return null;
  return new TextEncoder().encode(raw);
}

export function staffConfigured() {
  return staffSecretBytes() !== null;
}

export function staffLoginMatches(presented: string) {
  const expected = process.env.STAFF_API_SECRET;
  if (!expected || !staffSecretBytes()) return false;
  if (isDeployed() && tooWeak(expected, MIN_STAFF_SECRET)) return false;
  if (presented.length !== expected.length) return false;
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}
