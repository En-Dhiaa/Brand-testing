export interface AdminSessionPayload {
  adminId: string;
  email: string;
  exp: number; // Unix timestamp in seconds
}

export const SESSION_COOKIE_NAME = "seu_admin_token";
const SECRET = process.env.ADMIN_SESSION_SECRET || "seu-brand-studio-default-dev-secret-key-32";

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBuffer(base64url: string): ArrayBuffer {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(
  payload: Omit<AdminSessionPayload, "exp">,
  expiresInHours = 24
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const data: AdminSessionPayload = { ...payload, exp };
  const jsonStr = JSON.stringify(data);
  const encodedData = btoa(unescape(encodeURIComponent(jsonStr)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const key = await getKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedData)
  );
  const signature = bufferToBase64Url(signatureBuffer);

  return `${encodedData}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  if (!token || !token.includes(".")) return null;
  const [encodedData, signature] = token.split(".");
  if (!encodedData || !signature) return null;

  try {
    const key = await getKey();
    const signatureBuffer = base64UrlToBuffer(signature);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      new TextEncoder().encode(encodedData)
    );
    if (!isValid) return null;

    let base64 = encodedData.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const jsonStr = decodeURIComponent(escape(atob(base64)));
    const data: AdminSessionPayload = JSON.parse(jsonStr);

    const now = Math.floor(Date.now() / 1000);
    if (data.exp < now) return null;

    return data;
  } catch {
    return null;
  }
}
