import { NextResponse, type NextRequest } from "next/server";
import {
  MARKDOWN_TYPE,
  appendVaryAccept,
  notAcceptableBody,
  preferredType,
} from "@/lib/accept";

/*
 * Markdown content negotiation, the acceptmarkdown.com way: the same URL serves
 * HTML to browsers and markdown to agents, decided by the request's `Accept`
 * header, with `Vary: Accept` on both branches so no cache hands one audience
 * the other's bytes.
 *
 * Why here rather than in each page: a Server Component page renders HTML
 * unconditionally — there is no hook inside a page.tsx that can answer with a
 * different media type. Proxy is the one layer that sees the request before
 * the route does, which is why the site's Next.js recipe
 * (https://acceptmarkdown.com/recipes/nextjs) puts negotiation here too.
 *
 * "Proxy" is Next 16's name for what used to be middleware — same mechanism,
 * renamed; see node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md.
 *
 * The markdown branch rewrites to app/api/markdown/[[...slug]]/route.ts, which
 * is under /api and therefore outside the matcher below — so a rewritten
 * request cannot re-enter this function.
 */

const MARKDOWN_ROUTE = "/api/markdown";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Negotiation decides what a *reader* is handed. A POST here is a Server
   * Action — the join form (app/actions/join.ts) — and those travel with
   * `Accept: text/x-component`, a type this site does not produce. Negotiated
   * like a document it would earn a spec-correct 406 and the form would stop
   * submitting, so anything that is not a plain read passes straight through.
   *
   * GET-shaped RSC traffic needs no such guard, though it is the first thing
   * worth checking here: Next strips every flight header (`RSC`,
   * `Next-Router-Prefetch`, …) and the `_rsc` query param before proxy runs —
   * "Ensure users only see page requests, never data requests", in
   * next/dist/esm/server/web/adapter.js — so a client-side navigation is
   * indistinguishable from a document request at this layer. It is also
   * harmless: the RSC fetch sets no `Accept` of its own, so the browser's
   * default catch-all arrives, preferredType reads it as "no constraint", and
   * the request falls through to the HTML branch exactly as it should.
   */
  if (request.method !== "GET" && request.method !== "HEAD") {
    return passThrough();
  }

  const accept = request.headers.get("accept");
  const chosen = preferredType(accept);

  if (chosen === MARKDOWN_TYPE) {
    const url = request.nextUrl.clone();
    url.pathname = `${MARKDOWN_ROUTE}${pathname === "/" ? "" : pathname}`;
    const rewritten = NextResponse.rewrite(url);
    appendVaryAccept(rewritten.headers);
    return rewritten;
  }

  /*
   * Nothing we produce is acceptable — the client either listed types we do not
   * have (`Accept: application/pdf`) or rejected ours outright
   * (`text/html;q=0, text/markdown;q=0`). RFC 9110 §15.5.7 calls for a 406 with
   * a body naming the alternatives, rather than a silent fallback the client
   * would then mis-parse. A missing header, or one that is nothing but the
   * catch-all range, never lands here — preferredType reads both as "no
   * constraint" and returns the HTML default.
   */
  if (chosen === null) {
    const response = new NextResponse(notAcceptableBody(accept ?? ""), {
      status: 406,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        /* The same URL answers 200 for a different Accept — never cache this. */
        "Cache-Control": "no-store",
        Vary: "Accept",
      },
    });
    return response;
  }

  return passThrough();
}

/*
 * The HTML branch. `Vary: Accept` belongs on it just as much as on the markdown
 * one: without it a CDN that saw the markdown variant first would serve raw
 * markdown to the next browser that asked.
 *
 * Caveat, and the reason next.config.ts carries a `headers` entry for the same
 * nine paths: Next 16 overwrites `Vary` while rendering an App Router page
 * (`res.setHeader('Vary', …)` in next/dist/build/templates/app-page.js), which
 * lands after everything proxy sets. The append below is still correct and is
 * what actually ships the header on the markdown and 406 branches, where the
 * response never goes through a page render.
 */
function passThrough() {
  const response = NextResponse.next();
  appendVaryAccept(response.headers);
  return response;
}

export const config = {
  /*
   * Only the site's readable pages. Excluded:
   *   api/     — route handlers, including the markdown one this rewrites to
   *   _next/   — build output, image optimizer, RSC payloads
   *   _vercel/ — platform endpoints
   *   *.ext    — everything with a file extension, which covers both public/
   *              assets (/og.jpg, /logos/*.svg, /llms.txt) and the metadata
   *              routes (/sitemap.xml, /robots.txt, /favicon.ico,
   *              /apple-icon.png, /site.webmanifest). Those already carry the
   *              right media type; there is nothing to negotiate.
   *
   * What is left is exactly the extensionless page paths — the nine real ones
   * and every wrong guess, which is what makes the markdown 404 reachable.
   */
  matcher: ["/((?!api/|_next/|_vercel/|.*\\.[^/]+$).*)"],
};
