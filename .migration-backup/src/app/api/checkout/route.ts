import { NextResponse } from "next/server";

// Historical $5 records and their signed webhooks remain supported, but new
// purchases must use the patient-type-specific assessment route.
export async function POST() {
  return NextResponse.json({
    error: "The legacy $5 checkout is closed. Open /enroll for the Initial Patient Assessment.",
  }, { status: 410 });
}
