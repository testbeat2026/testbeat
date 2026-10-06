import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const myVerifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "testbeat_secure_webhook_token_2026";

  if (mode === "subscribe" && token === myVerifyToken) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new NextResponse("Token mismatch", { status: 403 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ status: "OK" });
}
