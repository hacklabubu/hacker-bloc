/*
 * HTTP content negotiation for the acceptmarkdown.com convention
 * (https://acceptmarkdown.com/start): one URL, two representations, picked by
 * the request's `Accept` header, with `Vary: Accept` on both branches so caches
 * key the two apart.
 *
 * Pure functions, no Next imports: proxy.ts negotiates with them at the edge of
 * the request and app/api/markdown/[[...slug]]/route.ts re-uses the header
 * helpers when it answers. Proxy code must not lean on shared *state*
 * (see node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md);
 * a module of pure helpers is exactly the "break proxy logic into separate
 * files" the same doc prescribes.
 */

/** RFC 7763's registered media type. Not `text/x-markdown`, not `application/markdown`. */
export const MARKDOWN_TYPE = "text/markdown";
export const HTML_TYPE = "text/html";

/** Content-Type for the markdown representation, charset spelled out. */
export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

/*
 * What this site can produce, best default first. `preferredType` falls back to
 * PRODUCES[0] when the client expresses no preference — no header, or nothing
 * but the catch-all range — so HTML has to lead: a browser that sends neither
 * must still get a page.
 */
const PRODUCES = [HTML_TYPE, MARKDOWN_TYPE] as const;

export type Producible = (typeof PRODUCES)[number];

type AcceptEntry = {
  type: string;
  q: number;
  /** catch-all = 0, `text/*` = 1, `text/markdown` = 2 — RFC 9110 §12.5.1 precedence. */
  specificity: number;
};

/*
 * `Accept` is a structured list, not a string. Substring matching gets a real
 * browser wrong: Chrome sends
 * `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp`
 * followed by the catch-all range at q=0.8. That header names no markdown at
 * all, yet it *does* match text/markdown through the catch-all — so whether an
 * agent or a human is asking is a question about ranking, never about which
 * substrings are present. Parse, then rank.
 */
function parseAccept(header: string): AcceptEntry[] {
  const entries: AcceptEntry[] = [];

  for (const raw of header.split(",")) {
    const parts = raw.trim().split(";");
    const type = parts[0].trim().toLowerCase();
    if (!type) continue;

    /* Absent `q` is 1 — "I want this as much as anything else I listed". */
    let q = 1;
    for (const param of parts.slice(1)) {
      const eq = param.indexOf("=");
      if (eq === -1) continue;
      if (param.slice(0, eq).trim().toLowerCase() !== "q") continue;
      const parsed = Number(param.slice(eq + 1).trim());
      /* A malformed q ("q=high") is not a rejection — leave the default. */
      if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
    }

    entries.push({
      type,
      q,
      specificity: type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2,
    });
  }

  return entries;
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === "*/*") return true;
  if (entry.type.endsWith("/*")) {
    return candidate.startsWith(entry.type.slice(0, -1));
  }
  return entry.type === candidate;
}

/**
 * The representation to serve, or `null` when the client rejected every one of
 * them — which is the only thing that earns a `406`.
 *
 * Ranking, per https://acceptmarkdown.com/guides/accept-parsing:
 *   1. For each candidate, the *most specific* matching range wins, regardless
 *      of q. That is what makes `text/html;q=0` followed by a catch-all at q=1
 *      reject HTML, instead of letting the wildcard resurrect it.
 *   2. `q=0` on the winning range means "never send me this" — skip it.
 *   3. Across candidates, highest q wins; ties break on the client's own order,
 *      so `Accept: text/markdown, text/html` picks markdown.
 *
 * A missing or empty header is "no constraint", not "nothing works": serve the
 * default. Same for a header that is only the catch-all range, which lands on
 * the default through rule 3's tie-break.
 */
export function preferredType(header: string | null | undefined): Producible | null {
  if (!header) return PRODUCES[0];
  const entries = parseAccept(header);
  if (entries.length === 0) return PRODUCES[0];

  let best: Producible | null = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of PRODUCES) {
    let matched: AcceptEntry | null = null;
    let matchedPosition = Infinity;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!matches(entry, candidate)) continue;
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && i < matchedPosition)
      ) {
        matched = entry;
        matchedPosition = i;
      }
    }

    if (matched === null) continue;
    if (matched.q <= 0) continue;

    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      best = candidate;
      bestQ = matched.q;
      bestPosition = matchedPosition;
    }
  }

  return best;
}

/**
 * Adds `Accept` to an existing `Vary` rather than replacing it.
 *
 * The App Router already varies its responses on `RSC`,
 * `Next-Router-State-Tree`, `Next-Router-Prefetch` and friends; clobbering that
 * list would break client-side navigation caching, and dropping `Accept` would
 * let a CDN hand an agent's markdown to a browser. Idempotent, so it is safe to
 * call on a response that has been through here already.
 */
export function appendVaryAccept(headers: Headers): void {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", "Accept");
    return;
  }
  /* `Vary: *` already means "never cache this" — narrowing it would be a lie. */
  const tokens = existing.split(",").map((t) => t.trim().toLowerCase());
  if (tokens.includes("*") || tokens.includes("accept")) return;
  headers.set("Vary", `${existing}, Accept`);
}

/**
 * The `406 Not Acceptable` body RFC 9110 §15.5.7 recommends: say what the
 * resource *can* be, so the client knows what to retry with. Plain text, since
 * the whole point is that the client refused both of our real types.
 */
export function notAcceptableBody(requested: string): string {
  return [
    "406 Not Acceptable",
    "",
    "This resource is available in:",
    `- ${HTML_TYPE}`,
    `- ${MARKDOWN_TYPE}`,
    "",
    `You requested: ${requested}`,
    "",
  ].join("\n");
}
