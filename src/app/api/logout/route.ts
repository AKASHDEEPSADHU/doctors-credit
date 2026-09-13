import { NextRequest, NextResponse } from "next/server";
import { allowRequest } from "@/lib/rate-limit";
import { clearSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  if (!allowRequest(req.headers, "logout", 20, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: true });
  }
  await clearSession();
  return NextResponse.json({ ok: true });
}
