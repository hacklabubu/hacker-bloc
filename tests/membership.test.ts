import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";

function load<T>(file: string, imports: Record<string, unknown>, env = {}) {
  const exports: Record<string, unknown> = {};
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(code, { exports, require: (name: string) => {
    if (!(name in imports)) throw new Error(`Unexpected import: ${name}`);
    return imports[name];
  }, process: { env }, console, Date });
  return exports as T;
}

test("members with database Date timestamps remain visible and sorted", async () => {
  let query = 0;
  const people = load<{ getPeople(): Promise<{ github: string | null; status: string; since: string }[] | null> }>("lib/people.ts", {
    "@/lib/db": { getSql: () => async () => ++query === 1 ? [
      { email: "later@example.com", github: "later", since: new Date("2026-09-15"), override: "resident" },
      { email: "earlier@example.com", github: "earlier", since: new Date("2026-09-11"), override: "resident" },
    ] : [{ since: new Date("2026-09-10") }] },
    "@/lib/founders": { isFounder: () => false },
  }, { DATABASE_URL: "configured" });
  const rows = await people.getPeople();
  assert.ok(rows);
  assert.equal(rows.length, 3);
  assert.equal(rows[0].github, "earlier");
  assert.equal(rows[1].github, "later");
  assert.equal(rows[2].status, "patron");
  assert.equal(rows[0].since, "2026-09-11T00:00:00.000Z");
});

for (const tier of ["founding", "member"] as const) {
  test(`${tier} checkout charges only its selected prices and billing schedule`, async () => {
    let session: { line_items: { price: string }[]; subscription_data: { trial_end?: number }; metadata: { tier: string }; success_url: string } | undefined;
    const actions = load<{ startMembershipCheckout(tier: string): Promise<unknown> }>("app/actions/membership.ts", {
      "next/navigation": { redirect: (url: string) => { throw new Error(`redirect:${url}`); } },
      "@/lib/auth": { getSessionUser: async () => ({ id: "user", email: "member@example.com" }) },
      "@/lib/membership": { MEMBERSHIP: { signupUsd: 1000, monthlyUsd: 100 }, formatUsd: (n: number) => `$${n}`, nextMonthUnix: () => 1800000000 },
      "@/lib/request-origin": { requestOrigin: async () => "https://example.com" },
      "@/lib/stripe": {
        getMembershipPrices: () => ({ monthly: "price_monthly", signup: "price_signup" }),
        getMembershipStripe: () => ({ checkout: { sessions: { create: async (input: NonNullable<typeof session>) => {
          session = input; return { url: "https://checkout.stripe.com/example" };
        } } } }),
      },
    });
    await assert.rejects(actions.startMembershipCheckout(tier), /redirect:https:\/\/checkout.stripe.com/);
    assert.ok(session);
    assert.equal(session.line_items.length, tier === "founding" ? 2 : 1);
    assert.equal(session.line_items[0].price, "price_monthly");
    assert.equal(session.subscription_data.trial_end, tier === "founding" ? 1800000000 : undefined);
    assert.equal(session.metadata.tier, tier);
    assert.ok(session.success_url.endsWith(`#${tier}`));
  });
}
