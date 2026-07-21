import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";

/* ============================================================================
   Stream Video — token minting endpoint.
   No real auth layer yet (the app is still demo-data driven), so the client
   sends the identity it wants to connect as. When Apex gets real sessions,
   derive `userId`/`name` from the session here instead of trusting the body.
   The API secret never leaves the server.
   ========================================================================= */

export const runtime = "nodejs";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const secret = process.env.STREAM_API_SECRET;

export async function POST(req) {
  if (!apiKey || !secret) {
    return NextResponse.json(
      { error: "Stream is not configured. Set NEXT_PUBLIC_STREAM_API_KEY and STREAM_API_SECRET in .env.local." },
      { status: 500 },
    );
  }

  let body = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is fine */
  }

  const userId = String(body.userId || "").trim();
  if (!userId || !/^[a-zA-Z0-9@_-]+$/.test(userId)) {
    return NextResponse.json({ error: "A valid userId is required." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.slice(0, 80) : userId;
  const image = typeof body.image === "string" ? body.image.slice(0, 500) : undefined;

  try {
    const client = new StreamClient(apiKey, secret);
    // Make the display name/avatar available to everyone in the call.
    await client.upsertUsers([{ id: userId, name, image, role: "user" }]);

    const validity = 60 * 60 * 12; // 12h
    const token = client.generateUserToken({ user_id: userId, validity_in_seconds: validity });

    return NextResponse.json({ token, apiKey, userId, name });
  } catch (err) {
    console.error("[stream/token] failed to mint token", err);
    return NextResponse.json({ error: "Failed to mint Stream token." }, { status: 500 });
  }
}
