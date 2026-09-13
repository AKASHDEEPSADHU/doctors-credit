export type AppEnv = "development" | "staging" | "production";

export function appEnv(): AppEnv {
  const raw = (process.env.APP_ENV || process.env.NEXTJS_ENV || "").toLowerCase();
  if (raw === "production" || raw === "staging" || raw === "development") return raw;
  return "development";
}

export function isProduction() {
  return appEnv() === "production";
}

export function demoPayments() {
  if (isProduction()) return process.env.ALLOW_DEMO_PAYMENTS === "true";
  return process.env.DEMO_PAYMENTS === "true" || !process.env.STRIPE_SECRET_KEY;
}

export function turnstileRequired() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
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
