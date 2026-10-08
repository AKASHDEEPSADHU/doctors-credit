import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { processCashfreeWebhook } from "@/lib/cashfree-webhook";
import { assessmentProvider } from "@/lib/payment-providers";
import { CASHFREE_WEBHOOK_VERSION } from "@/lib/payment-providers/cashfree";
import { getRepository } from "@/lib/repo";
import { tooLarge } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const provider = assessmentProvider();
  const requestId = randomUUID();
  const version = req.headers.get("x-webhook-version") || "";
  const diagnostic = {
    requestId, method: "POST", path: "/api/webhook/cashfree",
    configured: Boolean(provider.configured()),
    signaturePresent: Boolean(req.headers.get("x-webhook-signature")),
    timestampPresent: Boolean(req.headers.get("x-webhook-timestamp")),
    version: ["2026-01-01", "2025-01-01", "2023-08-01"].includes(version) ? version : version ? "other" : "missing",
  };
  // Never include request bodies, credentials, signature values, arbitrary
  // headers or provider exception messages in these diagnostic logs.
  console.info("[cashfree-webhook]", { ...diagnostic, stage: "received" });
  function respond(status: number, reason: string, data: { error: string } | { received: true }) {
    console.info("[cashfree-webhook]", { ...diagnostic, stage: "response", status, reason });
    return NextResponse.json(data, { status, headers: { "x-request-id": requestId } });
  }
  if (!diagnostic.configured) return respond(503, "configuration_missing", { error: "Sandbox confirmation is not configured." });
  if (tooLarge(req, 256000)) return respond(413, "body_too_large", { error: "Invalid request." });
  const body = await req.text();
  if (Buffer.byteLength(body) > 256000) return respond(413, "body_too_large", { error: "Invalid request." });
  const timestamp = req.headers.get("x-webhook-timestamp") || "";
  const signature = req.headers.get("x-webhook-signature") || "";
  if (!provider.verifyWebhook(body, timestamp, signature)) return respond(401, "signature_invalid", { error: "Invalid signature." });
  if (version !== CASHFREE_WEBHOOK_VERSION) return respond(400, "version_unsupported", { error: "Unsupported webhook version." });
  try {
    await processCashfreeWebhook(await getRepository(), provider, body, timestamp, signature, version);
    return respond(200, "verified", { received: true });
  } catch {
    // No raw body, provider exception, secret or signature is logged/exposed.
    return respond(503, "verification_error", { error: "Payment confirmation is pending verification." });
  }
}
