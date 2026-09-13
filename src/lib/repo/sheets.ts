import { importPKCS8, SignJWT } from "jose";
import { applicationToCrmRow, CRM_HEADERS, crmRowValues, type Application } from "@/lib/repo/types";

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

function parseAccount(): ServiceAccount {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set.");
  const parsed = JSON.parse(raw) as ServiceAccount;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("Google service account JSON is missing client_email or private_key.");
  }
  return parsed;
}

async function accessToken() {
  const account = parseAccount();
  const key = await importPKCS8(account.private_key.replace(/\\n/g, "\n"), "RS256");
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({
    scope: "https://www.googleapis.com/auth/spreadsheets",
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(account.client_email)
    .setSubject(account.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`Google token exchange failed (${res.status}).`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Google token exchange returned no access_token.");
  return data.access_token;
}

const SHEET = "Patient Applications";

async function sheets(path: string, init?: RequestInit) {
  const token = await accessToken();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set.");
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Sheets API ${res.status}: ${text.slice(0, 180)}`);
  }
  if (res.status === 204) return {};
  return res.json();
}

export async function upsertCrmRow(app: Application) {
  const row = crmRowValues(applicationToCrmRow(app));
  const existing = (await sheets(
    `/values/${encodeURIComponent(`${SHEET}!A:A`)}?majorDimension=COLUMNS`
  )) as { values?: string[][] };
  const ids = existing.values?.[0] || [];
  if (ids.length === 0) {
    await sheets(`/values/${encodeURIComponent(`${SHEET}!A1`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: "POST",
      body: JSON.stringify({ values: [CRM_HEADERS, row] }),
    });
    return;
  }
  const index = ids.findIndex((id, i) => i > 0 && id === app.applicationId);
  if (index === -1) {
    if (ids[0] !== CRM_HEADERS[0]) {
      await sheets(`/values/${encodeURIComponent(`${SHEET}!A1:Y1`)}?valueInputOption=RAW`, {
        method: "PUT",
        body: JSON.stringify({ values: [CRM_HEADERS] }),
      });
    }
    await sheets(`/values/${encodeURIComponent(`${SHEET}!A1`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: "POST",
      body: JSON.stringify({ values: [row] }),
    });
    return;
  }
  const range = `${SHEET}!A${index + 1}:Y${index + 1}`;
  await sheets(`/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({ values: [row] }),
  });
}
