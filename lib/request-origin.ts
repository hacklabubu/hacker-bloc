import { headers } from "next/headers";
import { SITE } from "@/lib/site";

/*
 * Stripe success and cancel URLs must be absolute. Behind Vercel the public
 * host and scheme arrive in the forwarded headers; locally it's the dev
 * server; and if neither says anything useful, the canonical origin.
 */
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return SITE.url;
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
