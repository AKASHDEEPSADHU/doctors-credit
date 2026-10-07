import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { demoGoogleAllowed, demoPayments } from "./env";
import { purchasablePackage } from "./packages";

const keys = [
  "APP_ENV",
  "DEMO_PAYMENTS",
  "ALLOW_DEMO_PAYMENTS",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "DODO_PAYMENTS_API_KEY",
] as const;
const snapshot = Object.fromEntries(keys.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const key of keys) {
    if (snapshot[key] === undefined) delete process.env[key];
    else process.env[key] = snapshot[key];
  }
});

describe("V1 purchasable SKUs", () => {
  it("allows only orientation", () => {
    assert.equal(purchasablePackage("orientation")?.sku, "orientation");
    assert.equal(purchasablePackage("direction"), null);
    assert.equal(purchasablePackage("journey"), null);
    assert.equal(purchasablePackage("unknown"), null);
  });
});

describe("production fail-closed flags", () => {
  it("ignores demo flags when APP_ENV=production", () => {
    process.env.APP_ENV = "production";
    process.env.DEMO_PAYMENTS = "true";
    process.env.ALLOW_DEMO_PAYMENTS = "true";
    process.env.GOOGLE_CLIENT_ID = "";
    process.env.GOOGLE_CLIENT_SECRET = "";
    assert.equal(demoPayments(), false);
    assert.equal(demoGoogleAllowed(), false);
  });

  it("uses the Dodo API key for local demo detection", () => {
    process.env.APP_ENV = "development";
    delete process.env.DEMO_PAYMENTS;
    process.env.DODO_PAYMENTS_API_KEY = "test-placeholder";
    assert.equal(demoPayments(), false);
    delete process.env.DODO_PAYMENTS_API_KEY;
    assert.equal(demoPayments(), true);
  });
});
