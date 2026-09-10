/*
 * Agent-readiness smoke tests against a running site.
 *   BASE_URL=http://localhost:3000 npm test        (dev server)
 *   BASE_URL=https://www.hackerbloc.com npm test  (production)
 * Every check mirrors a line of the Is Agentic / acceptmarkdown.com audits.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const NOWHERE = "/this-path-does-not-exist-" + Date.now();

const get = (path: string, accept?: string) =>
  fetch(`${BASE}${path}`, {
    redirect: "manual",
    headers: accept ? { Accept: accept } : {},
  });

const hasVaryAccept = (res: Response) =>
  (res.headers.get("vary") ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .includes("accept");

test("homepage is server-rendered with a heading hierarchy", async () => {
  const res = await get("/");
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<html[^>]*\slang="en"/);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, "exactly one h1");
  assert.ok((html.match(/<h2[\s>]/g) ?? []).length >= 2, "at least two h2");
  assert.ok((html.match(/<h3[\s>]/g) ?? []).length >= 1, "at least one h3");
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
  assert.ok(text.replace(/\s+/g, " ").length > 500, "500+ chars of text without JS");
});

test("homepage carries the four metadata signals", async () => {
  const html = await (await get("/")).text();
  assert.match(html, /<link rel="canonical" href="https?:\/\/[^"]+"/);
  assert.match(html, /<meta property="og:image" content="https?:\/\/[^"]+"/);
  assert.match(html, /<meta property="og:type" content="website"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"Organization"/);
});

test("Accept: text/markdown returns markdown with Vary: Accept", async () => {
  const res = await get("/", "text/markdown");
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /^text\/markdown/);
  assert.ok(hasVaryAccept(res), `Vary must include Accept, got ${res.headers.get("vary")}`);
  const body = await res.text();
  assert.match(body, /^# /);
  assert.match(body, /llms\.txt/);
});

/*
 * On Vercel the HTML variant's `Vary: Accept` comes from next.config.ts
 * `headers` at the routing layer, because Next overwrites Vary during the
 * page render (see the comment there). Under `next dev`/`next start` that
 * layer does not exist, so this check only applies to a deployed host.
 */
const DEPLOYED = BASE.startsWith("https://");

test("HTML variant also varies on Accept", { skip: !DEPLOYED && "only on a deployed host" }, async () => {
  const res = await get("/", "text/html");
  assert.match(res.headers.get("content-type") ?? "", /^text\/html/);
  assert.ok(hasVaryAccept(res), `Vary must include Accept, got ${res.headers.get("vary")}`);
});

test("unacceptable Accept gets a 406 that names the alternatives", async () => {
  const res = await get("/", "application/pdf");
  assert.equal(res.status, 406);
  assert.match(await res.text(), /text\/markdown/);
});

test("nonexistent path is a real 404 in HTML, pointing at the maps", async () => {
  const res = await get(NOWHERE);
  assert.equal(res.status, 404);
  const html = await res.text();
  assert.match(html, /sitemap\.xml/);
  assert.match(html, /llms\.txt/);
});

test("nonexistent path is a real 404 in markdown with recovery links", async () => {
  const res = await get(NOWHERE, "text/markdown");
  assert.equal(res.status, 404);
  assert.match(res.headers.get("content-type") ?? "", /^text\/markdown/);
  const body = await res.text();
  assert.match(body, /sitemap\.xml/);
  assert.match(body, /llms\.txt/);
  assert.match(body, /\[Home\]\(/);
});

test("llms.txt, sitemap and robots exist", async () => {
  for (const path of ["/llms.txt", "/sitemap.xml", "/robots.txt"]) {
    const res = await get(path);
    assert.equal(res.status, 200, path);
  }
  const sitemap = await (await get("/sitemap.xml")).text();
  assert.match(sitemap, /<loc>https?:\/\/[^<]+\/membership<\/loc>/);
});

test("every sitemap URL serves markdown on request", async () => {
  const sitemap = await (await get("/sitemap.xml")).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  assert.ok(locs.length >= 8, "sitemap lists the site");
  for (const path of locs) {
    const res = await get(path, "text/markdown");
    assert.equal(res.status, 200, path);
    assert.match(res.headers.get("content-type") ?? "", /^text\/markdown/, path);
  }
});
