import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Sign in with Google to open your file." },
    { status: 410 }
  );
}
