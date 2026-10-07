import { NextRequest, NextResponse } from "next/server";
import { requestOrigin } from "@/lib/origin";
import { allowRequest } from "@/lib/rate-limit";
import { clearSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const origin = requestOrigin(req);
  const accept = req.headers.get("accept") || "";
  const contentType = req.headers.get("content-type") || "";
  const asForm = contentType.includes("form") || accept.includes("text/html");
  const res = asForm ? NextResponse.redirect(new URL("/", origin), 303) : NextResponse.json({ ok: true });
  if (!allowRequest(req.headers, "logout", 20, 10 * 60 * 1000)) {
    await clearSession(res);
    return res;
  }
  await clearSession(res);
  return res;
}
