import { NextRequest, NextResponse } from "next/server";
import { processCashfreeWebhook } from "@/lib/cashfree-webhook";
import { assessmentProvider } from "@/lib/payment-providers";
import { CASHFREE_WEBHOOK_VERSION } from "@/lib/payment-providers/cashfree";
import { getRepository } from "@/lib/repo";
import { tooLarge } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const provider = assessmentProvider();
  if (!provider.configured()) return NextResponse.json({ error: "Sandbox confirmation is not configured." }, { status: 503 });
  if (tooLarge(req, 256000)) return NextResponse.json({ error: "Invalid request." }, { status: 413 });
  const body = await req.text();
  if (Buffer.byteLength(body) > 256000) return NextResponse.json({ error: "Invalid request." }, { status: 413 });
  const timestamp = req.headers.get("x-webhook-timestamp") || "";
  const signature = req.headers.get("x-webhook-signature") || "";
  if (!provider.verifyWebhook(body, timestamp, signature)) return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  const version = req.headers.get("x-webhook-version") || "";
  if (version !== CASHFREE_WEBHOOK_VERSION) return NextResponse.json({ error: "Unsupported webhook version." }, { status: 400 });
  try {
    await processCashfreeWebhook(await getRepository(), provider, body, timestamp, signature, version);
    return NextResponse.json({ received: true });
  } catch {
    // No raw body, provider exception, secret or signature is logged/exposed.
    return NextResponse.json({ error: "Payment confirmation is pending verification." }, { status: 503 });
  }
}
