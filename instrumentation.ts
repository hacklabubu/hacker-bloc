/*
 * `Vary: Accept` on every response.
 *
 * Every page on this site is content-negotiated (proxy.ts serves markdown for
 * `Accept: text/markdown` and HTML otherwise), so every response must carry
 * `Accept` in its `Vary` header or a shared cache may hand one audience the
 * other's bytes. proxy.ts appends it, but Next 16 overwrites `Vary`
 * unconditionally while rendering an App Router page (`res.setHeader('Vary',
 * …)` in next/dist/build/templates/app-page.js), which lands after the proxy,
 * and nothing inside a page can add a response header.
 *
 * So the one place left is the Node response itself: lib/vary-accept.ts makes
 * `setHeader('Vary', …)` keep `Accept` in the list. This hook runs once per
 * server instance and loads it on the Node runtime only.
 *
 * Reference: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation.md
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { patchVaryAccept } = await import("./lib/vary-accept");
    patchVaryAccept();
  }
}
