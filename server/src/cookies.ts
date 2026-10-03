import type { CookieOptions } from "@supabase/ssr";

export function parseCookieHeader(header: string | undefined): { name: string; value: string }[] {
  if (!header) return [];
  return header.split(";").flatMap((part) => {
    const eq = part.indexOf("=");
    if (eq < 1) return [];
    const name = part.slice(0, eq).trim();
    const raw = part.slice(eq + 1).trim();
    if (!name) return [];
    try {
      return [{ name, value: decodeURIComponent(raw) }];
    } catch {
      return [{ name, value: raw }];
    }
  });
}

export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path ?? "/"}`];
  if (options.maxAge != null) parts.push(`Max-Age=${options.maxAge}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite === true ? "Strict" : options.sameSite}`);
  if (options.domain) parts.push(`Domain=${options.domain}`);
  return parts.join("; ");
}
