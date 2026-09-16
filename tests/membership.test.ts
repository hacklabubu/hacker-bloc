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
  }, process: { env }, console, Date, Response });
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

for (const signedIn of [true, false]) {
for (const tier of ["founding", "member"] as const) {
  test(`${signedIn ? "account" : "guest"} ${tier} checkout charges only its selected prices and billing schedule`, async () => {
    let session: { line_items: { price: string }[]; subscription_data: { trial_end?: number }; metadata: { tier: string; supabase_user_id?: string }; customer_email?: string; client_reference_id?: string; success_url: string } | undefined;
    const actions = load<{ startMembershipCheckout(tier: string): Promise<unknown> }>("app/actions/membership.ts", {
      "next/navigation": { redirect: (url: string) => { throw new Error(`redirect:${url}`); } },
      "@/lib/auth": { getSessionUser: async () => signedIn ? ({ id: "user", email: "member@example.com" }) : null },
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
    assert.equal(session.customer_email, signedIn ? "member@example.com" : undefined);
    assert.equal(session.client_reference_id, signedIn ? "user" : undefined);
    assert.equal(session.metadata.supabase_user_id, signedIn ? "user" : undefined);
    assert.ok(session.success_url.endsWith(`#${tier}`));
  });
}

}

for (const paid of [true, false]) {
  test(`signed async checkout ${paid ? "paid" : "unpaid"} records independently of accounts`, async () => {
    let emails = 0;
    const queries: string[] = [];
    const event = { id: "evt_test", type: "checkout.session.async_payment_succeeded", data: { object: {
      id: "cs_test", mode: "subscription", metadata: { kind: "membership" },
      customer: "cus_test", subscription: "sub_test", payment_status: paid ? "paid" : "unpaid",
      customer_details: { email: "guest@example.com" }, created: 1800000000,
    } } };
    const route = load<{ POST(request: unknown): Promise<Response> }>("app/api/stripe/webhook/route.ts", {
      stripe: { default: { webhooks: { constructEventAsync: async () => event } } },
      "@/lib/db": { getSql: () => async (parts: TemplateStringsArray) => { queries.push(parts.join("?")); return []; } },
      "@/lib/membership-email": { sendMembershipSetupEmail: async (id: string, email: string) => {
        assert.equal(id, "cs_test"); assert.equal(email, "guest@example.com"); emails++;
      } },
    }, { STRIPE_WEBHOOK_SECRET: "test" });
    const response = await route.POST({ headers: { get: () => "signed" }, text: async () => "body" });
    assert.equal(response.status, 200);
    assert.ok(queries.some(q => q.includes("INSERT INTO members")));
    assert.equal(emails, paid ? 1 : 0);
  });
}

test("email failure keeps membership saved and lets Stripe retry", async () => {
  const queries: string[] = [];
  const route = load<{ POST(request: unknown): Promise<Response> }>("app/api/stripe/webhook/route.ts", {
    stripe: { default: { webhooks: { constructEventAsync: async () => ({ id: "evt_retry", type: "checkout.session.completed", data: { object: {
      id: "cs_retry", mode: "subscription", metadata: { kind: "membership" }, customer: "cus_retry",
      payment_status: "paid", customer_details: { email: "guest@example.com" }, created: 1800000000,
    } } }) } } },
    "@/lib/db": { getSql: () => async (parts: TemplateStringsArray) => { queries.push(parts.join("?")); return []; } },
    "@/lib/membership-email": { sendMembershipSetupEmail: async () => { throw new Error("email unavailable"); } },
  }, { STRIPE_WEBHOOK_SECRET: "test" });
  await assert.rejects(route.POST({ headers: { get: () => "signed" }, text: async () => "body" }), /email unavailable/);
  assert.ok(queries.some(q => q.includes("INSERT INTO members")));
  assert.ok(!queries.some(q => q.includes("INSERT INTO stripe_events")));
});

test("restroom checkout charges exactly 210 USD once without an account", async () => {
  let session: { mode: string; line_items: { quantity: number; price_data: { currency: string; unit_amount: number } }[]; metadata: { wishlist_item: string }; success_url: string } | undefined;
  const actions = load<{ startRestroomCheckout(): Promise<unknown> }>("app/actions/wishlist.ts", {
    "next/navigation": { redirect: (url: string) => { throw new Error(`redirect:${url}`); } },
    "@/lib/request-origin": { requestOrigin: async () => "https://example.com" },
    "@/lib/stripe": { getStripe: () => ({ checkout: { sessions: { create: async (input: NonNullable<typeof session>) => {
      session = input; return { url: "https://checkout.stripe.com/test" };
    } } } }) },
  });
  await assert.rejects(actions.startRestroomCheckout(), /redirect:https:\/\/checkout.stripe.com/);
  assert.ok(session);
  assert.equal(session.mode, "payment");
  assert.equal(session.line_items.length, 1);
  assert.equal(session.line_items[0].quantity, 1);
  assert.equal(session.line_items[0].price_data.currency, "usd");
  assert.equal(session.line_items[0].price_data.unit_amount, 21000);
  assert.equal(session.metadata.wishlist_item, "restroom-essentials");
  assert.equal(session.success_url, "https://example.com/wishlist?restroom=thanks#items");
});

test("kitchen checkout charges exactly 1200 USD once without an account", async () => {
  let session: { mode: string; line_items: { quantity: number; price_data: { currency: string; unit_amount: number } }[]; metadata: { wishlist_item: string }; success_url: string } | undefined;
  const actions = load<{ startKitchenCheckout(): Promise<unknown> }>("app/actions/wishlist.ts", {
    "next/navigation": { redirect: (url: string) => { throw new Error(`redirect:${url}`); } },
    "@/lib/request-origin": { requestOrigin: async () => "https://example.com" },
    "@/lib/stripe": { getStripe: () => ({ checkout: { sessions: { create: async (input: NonNullable<typeof session>) => {
      session = input; return { url: "https://checkout.stripe.com/test" };
    } } } }) },
  });
  await assert.rejects(actions.startKitchenCheckout(), /redirect:https:\/\/checkout.stripe.com/);
  assert.ok(session);
  assert.equal(session.mode, "payment");
  assert.equal(session.line_items.length, 1);
  assert.equal(session.line_items[0].quantity, 1);
  assert.equal(session.line_items[0].price_data.currency, "usd");
  assert.equal(session.line_items[0].price_data.unit_amount, 120000);
  assert.equal(session.metadata.wishlist_item, "mini-kitchen");
  assert.equal(session.success_url, "https://example.com/wishlist?kitchen=thanks#items");
});

test("monitor checkout charges exactly 750 USD once without an account", async () => {
  let session: { mode: string; line_items: { quantity: number; price_data: { currency: string; unit_amount: number } }[]; metadata: { wishlist_item: string }; success_url: string } | undefined;
  const actions = load<{ startMonitorsCheckout(): Promise<unknown> }>("app/actions/wishlist.ts", {
    "next/navigation": { redirect: (url: string) => { throw new Error(`redirect:${url}`); } },
    "@/lib/request-origin": { requestOrigin: async () => "https://example.com" },
    "@/lib/stripe": { getStripe: () => ({ checkout: { sessions: { create: async (input: NonNullable<typeof session>) => {
      session = input; return { url: "https://checkout.stripe.com/test" };
    } } } }) },
  });
  await assert.rejects(actions.startMonitorsCheckout(), /redirect:https:\/\/checkout.stripe.com/);
  assert.ok(session);
  assert.equal(session.mode, "payment");
  assert.equal(session.line_items.length, 1);
  assert.equal(session.line_items[0].quantity, 1);
  assert.equal(session.line_items[0].price_data.currency, "usd");
  assert.equal(session.line_items[0].price_data.unit_amount, 75000);
  assert.equal(session.metadata.wishlist_item, "five-4k-monitors");
  assert.equal(session.success_url, "https://example.com/wishlist?monitors=thanks#items");
});

test("lighting checkout charges exactly 500 USD once without an account", async () => {
  let session: { mode: string; line_items: { quantity: number; price_data: { currency: string; unit_amount: number } }[]; metadata: { wishlist_item: string }; success_url: string } | undefined;
  const actions = load<{ startLightingCheckout(): Promise<unknown> }>("app/actions/wishlist.ts", {
    "next/navigation": { redirect: (url: string) => { throw new Error(`redirect:${url}`); } },
    "@/lib/request-origin": { requestOrigin: async () => "https://example.com" },
    "@/lib/stripe": { getStripe: () => ({ checkout: { sessions: { create: async (input: NonNullable<typeof session>) => {
      session = input; return { url: "https://checkout.stripe.com/test" };
    } } } }) },
  });
  await assert.rejects(actions.startLightingCheckout(), /redirect:https:\/\/checkout.stripe.com/);
  assert.ok(session);
  assert.equal(session.mode, "payment");
  assert.equal(session.line_items.length, 1);
  assert.equal(session.line_items[0].quantity, 1);
  assert.equal(session.line_items[0].price_data.currency, "usd");
  assert.equal(session.line_items[0].price_data.unit_amount, 50000);
  assert.equal(session.metadata.wishlist_item, "lighting-and-decoration");
  assert.equal(session.success_url, "https://example.com/wishlist?lighting=thanks#items");
});
