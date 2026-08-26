import {
  MARKDOWN_CONTENT_TYPE,
  appendVaryAccept,
} from "@/lib/accept";
import { markdownFor, markdownNotFound } from "@/lib/markdown";

/*
 * The markdown representation of every public page.
 *
 * Nothing links here and nothing should: this route exists to be rewritten to
 * by proxy.ts when a request's `Accept` header prefers `text/markdown`. The URL
 * the client sees stays the canonical one (/rules, not /api/markdown/rules) —
 * that is what a rewrite is, and it is what makes content negotiation
 * negotiation rather than a second set of URLs to discover.
 *
 * The catch-all is optional (`[[...slug]]`) so that `/` — which rewrites to
 * /api/markdown with no segments — resolves here too.
 */

/*
 * Freshness matches the HTML: the Notion reads behind /rules and /community are
 * cached for 300s in lib/notion.ts and the Luma calendar for 1800s in
 * lib/luma.ts, so the markdown is never staler than the page it mirrors and
 * costs no extra CRM calls.
 *
 * `s-maxage` is what puts the two representations in the shared cache at all,
 * and `Vary: Accept` below is what keeps them apart there — see
 * https://acceptmarkdown.com/guides/caching-cdn.
 */
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";

function markdownResponse(body: string, status: number): Response {
  const headers = new Headers({
    "Content-Type": MARKDOWN_CONTENT_TYPE,
    "Cache-Control": status === 200 ? CACHE_CONTROL : "no-store",
  });
  appendVaryAccept(headers);
  return new Response(body, { status, headers });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;
  const pathname = `/${slug.join("/")}`;

  const body = await markdownFor(pathname);

  /*
   * Item two of the audit: an agent that asked for markdown and guessed the URL
   * wrong gets a real 404 whose body is still markdown — a "no such page" line
   * and the way back in — instead of the branded HTML page, which stays exactly
   * where it is for browsers (app/not-found.tsx).
   */
  if (body === null) {
    return markdownResponse(markdownNotFound(pathname), 404);
  }

  return markdownResponse(body, 200);
}
