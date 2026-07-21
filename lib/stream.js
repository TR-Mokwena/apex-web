"use client";

import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { getAuthEmail } from "@/lib/auth";

/* ============================================================================
   Stream Video — client-side helpers.
   Apex has no real auth yet, so we mint a stable per-browser demo identity and
   let the server (/api/stream/token) hand back a token for it. Swap getDemoUser
   for the real signed-in user once auth lands.
   ========================================================================= */

export const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
export const isStreamConfigured = Boolean(apiKey);

const UID_KEY = "apex.stream.uid";
const NAME_KEY = "apex.stream.name";

// A stable id per browser so re-joins reuse the same participant identity.
export function getDemoUser() {
  if (typeof window === "undefined") return { id: "guest", name: "Guest" };
  let id = localStorage.getItem(UID_KEY);
  if (!id) {
    id = "apex-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(UID_KEY, id);
  }
  const name = localStorage.getItem(NAME_KEY) || "You";
  return { id, name };
}

export function setDemoUserName(name) {
  if (typeof window !== "undefined" && name) localStorage.setItem(NAME_KEY, name);
}

// Stream user ids allow only [a-zA-Z0-9@_-] — turn any string into a stable one.
export const sanitizeId = (s = "") => String(s).trim().toLowerCase().replace(/[^a-z0-9@_-]+/g, "_").replace(/^_+|_+$/g, "") || "guest";
export const idFromEmail = (email = "") => sanitizeId(email);
export const idFromName = (name = "") => sanitizeId(name);
export const nameFromEmail = (email = "") =>
  (email.split("@")[0] || email).split(/[._-]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || "Apex user";

// The current identity Stream connects as. Derived from the signed-in email so
// two browsers signed in as different people are two real, callable users.
// Falls back to the anonymous per-browser demo id when no email is on record.
export function getCurrentUser() {
  if (typeof window === "undefined") return { id: "guest", name: "Guest" };
  const email = getAuthEmail();
  if (email) return { id: idFromEmail(email), name: nameFromEmail(email), email };
  return getDemoUser();
}

// Server call to mint a token for this user. Used as the client's tokenProvider,
// so the SDK can transparently refresh it when it expires.
function makeTokenProvider(user) {
  return async () => {
    const res = await fetch("/api/stream/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, name: user.name }),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      throw new Error(error || `Token request failed (${res.status})`);
    }
    const { token } = await res.json();
    return token;
  };
}

// getOrCreateInstance de-dupes across React StrictMode double-mounts and
// re-renders, returning the same connected client for a given user.
export function getVideoClient(user = getCurrentUser()) {
  if (!apiKey) return null;
  return StreamVideoClient.getOrCreateInstance({
    apiKey,
    user: { id: user.id, name: user.name },
    tokenProvider: makeTokenProvider(user),
  });
}
