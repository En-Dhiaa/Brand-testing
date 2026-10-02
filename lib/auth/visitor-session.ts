import crypto from "crypto";

export const VISITOR_COOKIE_NAME = "seu_visitor_id";

export function getOrCreateVisitorId(existingCookieValue?: string | null): string {
  if (existingCookieValue && existingCookieValue.length >= 16) {
    return existingCookieValue;
  }
  return "v_" + crypto.randomBytes(16).toString("hex");
}
