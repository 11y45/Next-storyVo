// lib/admin-auth.ts
// Single-password admin auth for a solo project.
// The cookie holds an HMAC derived from ADMIN_PASSWORD, so it can't be forged
// without knowing the password, and changing the password logs everyone out.

import "server-only";

import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "storyvo_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not set in your environment.");
  return secret;
}

function sessionToken(): string {
  return createHmac("sha256", getSecret())
    .update("storyvo-admin-session")
    .digest("hex");
}

// Hash both sides first so timingSafeEqual always gets equal-length buffers.
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string): boolean {
  return safeEqual(input, getSecret());
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;
  return safeEqual(value, sessionToken());
}

/** Throws if the request isn't an authenticated admin. Use in data functions. */
export async function assertAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
