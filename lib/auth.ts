export const ADMIN_COOKIE = "rcdev_admin";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export function normalizeSecret(value: string | undefined | null) {
  if (!value) return "";
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function getAdminPassword() {
  const configured = normalizeSecret(process.env.ADMIN_PASSWORD);
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return "admin";
  return "";
}

function getSecret() {
  return process.env.ADMIN_SECRET || getAdminPassword() || "rcdev-dev-secret";
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  for (let i = 0; i < arr.length; i += 1) {
    str += String.fromCharCode(arr[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

async function hmacSha256(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toBase64Url(signature);
}

export async function createSessionToken() {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_MS });
  const data = toBase64Url(new TextEncoder().encode(payload));
  const signature = await hmacSha256(data);
  return `${data}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const [data, signature] = token.split(".");
  if (!data || !signature) return false;

  const expected = await hmacSha256(data);
  if (expected.length !== signature.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (mismatch !== 0) return false;

  try {
    const json = new TextDecoder().decode(fromBase64Url(data));
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MS / 1000,
  };
}
