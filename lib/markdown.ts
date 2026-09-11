/*
 * The markdown representation of every public page — the bytes an agent gets
 * when it asks for `Accept: text/markdown` (see lib/accept.ts and proxy.ts).
 *
 * Authored, not scraped. https://acceptmarkdown.com/guides/generating-markdown
 * lists three ways to produce the variant; runtime HTML-to-markdown is the
 * worst of them here, because these pages are brutalist layout as much as
 * they are prose — dithered hero canvases, before/after photo sliders, tab
 * rows — and a turndown pass would hand agents the scaffolding it is the whole
 * point to strip. So the prose below is written from the page components, and
 * everything that is *data* is read from where the pages read it:
 *
 *   - lib/site.ts     — address, emails, socials
 *   - lib/community.ts — join types, ladder assembly
 *   - lib/notion.ts   — live rules, house roles, members (revalidate 300)
 *   - lib/luma.ts     — live event calendar (revalidate 1800)
 *
 * Prose that also exists in a component carries a pointer to it; when the copy
 * on a page changes, its section here is the second place to change.
 *
 * Server-only by construction: the Notion helpers read NOTION_TOKEN, so this
 * module must never be imported from a "use client" component.
 */

import { JOIN_TYPES, authorityLadder } from "@/lib/community";
import { getPastEvents, getUpcomingEvents, type LumaEvent } from "@/lib/luma";
import {
  MEMBERSHIP,
  RISK_NOTE,
  ROADMAP,
  formatUsd,
} from "@/lib/membership";
import { authConfigured } from "@/lib/auth";
import { membershipCheckoutEnabled, patronCheckoutEnabled } from "@/lib/stripe";
import { getHouseRoles, getMembers, getRules } from "@/lib/notion";
import { getPeople } from "@/lib/people";
import { REFUNDS, TERMS, type LegalDoc } from "@/lib/legal";
import { LUMA, OPERATOR, SITE } from "@/lib/site";

/* ── page registry ─────────────────────────────────────────────── */

/*
 * Every path that has a markdown representation, in sitemap order. The keys are
 * the canonical, extensionless, trailing-slash-free paths — normalizePath below
 * is what guarantees a request arrives in that shape.
 *
 * Anything not in here 404s with markdownNotFound(), which is the point of item
 * two in the audit: an agent that asks for markdown at a dead URL should be
 * handed the way back in, not a wall of branded HTML.
 */
const PAGES: Record<string, () => string | Promise<string>> = {
  "/": homeMarkdown,
  "/events": eventsMarkdown,
  "/membership": membershipMarkdown,
  "/roadmap": roadmapMarkdown,
  "/wishlist": wishlistMarkdown,
  "/members": membersMarkdown,
  "/rules": rulesMarkdown,
  "/join": joinMarkdown,
  "/terms": () => legalMarkdown(TERMS),
  "/refunds": () => legalMarkdown(REFUNDS),
  "/privacy": privacyMarkdown,
};

/*
 * Canonical form of a request path: leading slash, no trailing slash.
 *
 * Deliberately case-sensitive, because Next's own routing is: /ABOUT is a 404
 * as HTML, so it has to be a 404 as markdown too. Lower-casing here would hand
 * an agent a 200 at a URL a browser cannot reach.
 */
export function normalizePath(pathname: string): string {
  const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const trimmed = withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
  return trimmed || "/";
}

/** The markdown for a path, or `null` when nothing lives there. */
export async function markdownFor(pathname: string): Promise<string | null> {
  const build = PAGES[normalizePath(pathname)];
  if (!build) return null;
  return await build();
}

/* ── shared furniture ──────────────────────────────────────────── */

const LLMS_TXT = `${SITE.url}/llms.txt`;
const SITEMAP = `${SITE.url}/sitemap.xml`;

function url(path: string): string {
  return path === "/" ? `${SITE.url}/` : `${SITE.url}${path}`;
}

/*
 * The header every markdown page opens with: what this document is, what it is
 * the markdown of, and the two files that map the rest of the site. Kept to
 * four lines — an agent paying for this in tokens should reach the content fast.
 */
function doc(path: string, title: string, body: string): string {
  return [
    `# ${SITE.name} — ${title}`,
    "",
    `> Markdown representation of ${url(path)} — the same content this URL serves as HTML.`,
    `> Agent guide: ${LLMS_TXT} · Sitemap: ${SITEMAP}`,
    "",
    "---",
    "",
    body.trim(),
    "",
    "---",
    "",
    `_${SITE.name} · ${SITE.address} · ${SITE.email}_`,
    "",
  ].join("\n");
}

/** Bulleted list, empty-safe. */
function list(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

/** Numbered list starting at 1. */
function ordered(items: readonly string[]): string {
  return items.map((item, i) => `${i + 1}. ${item}`).join("\n");
}

/* ── / ─────────────────────────────────────────────────────────── */

/* Mirrors the overview in app/page.tsx. */
async function homeMarkdown(): Promise<string> {
  const upcoming = (await getUpcomingEvents()).slice(0, 2);
  const body = [
    "A space for people who build.",
    "",
    `${SITE.city} / ${SITE.district} / ${SITE.postal.streetAddress}`,
    "",
    "We're building Palo Alto at home. We want the kind of space we saw in San Francisco: a house where startup founders meet, build, start their first Delaware C-corp, get their first check, find cofounders, and eventually build billion-dollar companies.",
    "",
    "We are not community builders. We are founders. We rented this house to build the next trillion-dollar company, [hacklab.so](https://hacklab.so), and we live and work here 24/7. We're pre-seed, pre-revenue, [pure potential](https://www.youtube.com/shorts/n5dAIvH2cQw), so we figured a hackerspace would help us not die in the initial grind.",
    "",
    "If you want a place like this in Warsaw, and want to help Poland become Europe's Silicon Valley, there are two ways in.",
    "",
    "## Become a member",
    "",
    `**${formatUsd(MEMBERSHIP.monthlyUsd)} USD per month + ${formatUsd(MEMBERSHIP.signupUsd)} USD one-time signup fee.** First ${MEMBERSHIP.limit} members. No refunds.`,
    "",
    list(MEMBERSHIP.benefits.map((benefit) => benefit.description)),
    "",
    `[Become a member](${url("/membership")}#member)`,
    "",
    "## Become a patron",
    "",
    `Not moving in, but want this to exist? Put any amount into the space: [become a patron](${url("/membership")}#patron).`,
    "",
    "## What is on",
    "",
    upcoming.length > 0
      ? list(upcoming.map(calendarEventLine))
      : "Nothing scheduled right now. The calendar fills up fast.",
    "",
    `[All events](${url("/events")}) · [Read the rules](${url("/rules")}) · [See the roadmap](${url("/roadmap")}) · [Calendar](${LUMA.calendarUrl})`,
  ].join("\n");

  return doc("/", "Home", body);
}

/* ── /events ──────────────────────────────────────────────────── */

/* Matches the calendar's event-local dates in app/events/page.tsx. */
function calendarEventLine(event: LumaEvent): string {
  const date = new Date(event.startAt);
  let when = "Date to be announced";

  if (!Number.isNaN(date.getTime())) {
    let timezone = event.timezone || "UTC";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    };
    let formatter: Intl.DateTimeFormat;

    try {
      formatter = new Intl.DateTimeFormat("en-GB", { ...options, timeZone: timezone });
    } catch {
      timezone = "UTC";
      formatter = new Intl.DateTimeFormat("en-GB", { ...options, timeZone: timezone });
    }

    when = `${formatter.format(date)} (${timezone})`;
  }

  const where = event.address ? ` — ${event.address}` : "";
  return `[${event.name}](${event.url}) — ${when}${where}`;
}

async function eventsMarkdown(): Promise<string> {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);
  const sections = [
    "Meetups, workshops, and hackathons at the bloc. Find your next event and RSVP on Luma.",
    "",
    `[Open the calendar](${LUMA.calendarUrl})`,
    "",
    "## Upcoming",
    "",
    upcoming.length > 0
      ? list(upcoming.slice(0, 8).map(calendarEventLine))
      : `No upcoming events to show here right now. Check the [calendar](${LUMA.calendarUrl}) for the latest.`,
  ];

  if (past.length > 0) {
    sections.push("", "## Recently at the bloc", "", list(past.slice(0, 5).map(calendarEventLine)));
  }

  return doc("/events", "Events", sections.join("\n"));
}

/* ── /membership ──────────────────────────────────────────────── */

/* Mirrors app/membership/page.tsx: the two ways to pay, and the small print. */
function membershipMarkdown(): string {
  const memberEnabled = membershipCheckoutEnabled();
  const patronEnabled = patronCheckoutEnabled();
  const body = [
    `Become one of the first ${MEMBERSHIP.limit} members of the Bloc.`,
    "",
    "## Become a member",
    "",
    `**${formatUsd(MEMBERSHIP.monthlyUsd)} USD per month + ${formatUsd(MEMBERSHIP.signupUsd)} USD one-time signup fee.** ${formatUsd(MEMBERSHIP.signupUsd)} today, then ${formatUsd(MEMBERSHIP.monthlyUsd)} a month from next month.`,
    "",
    list(MEMBERSHIP.benefits.map((benefit) => benefit.description)),
    "",
    authConfigured()
      ? `Step one: [create an account](${url("/auth/sign-up")}). Step two: ${
          memberEnabled
            ? `press "Become a member" on [the membership page](${url("/membership")}#member); checkout is hosted by Stripe. By paying you accept the [terms](${url("/terms")}) and [refund policy](${url("/refunds")}); read the risk note below.`
            : "payments open soon; members with an account will be emailed."
        }`
      : "Accounts and payments open soon.",
    "",
    "## Become a patron",
    "",
    "Not moving in, but want this to exist? Put any amount into the space.",
    "",
    patronEnabled
      ? `Enter an amount on [the membership page](${url("/membership")}#patron); checkout is hosted by Stripe.`
      : "Payments open soon.",
    "",
    "## Where the money goes",
    "",
    `${MEMBERSHIP.rentPercent}% rent, ${MEMBERSHIP.setupPercent}% setting up the space. [See the roadmap](${url("/roadmap")}).`,
    "",
    ...(MEMBERSHIP.taken > 0
      ? ["## Spots", "", `${MEMBERSHIP.taken} / ${MEMBERSHIP.limit} taken.`, ""]
      : []),
    "## Risk",
    "",
    RISK_NOTE,
  ].join("\n");

  return doc("/membership", "Membership", body);
}

/* ── /roadmap ─────────────────────────────────────────────────── */

function roadmapMarkdown(): string {
  const body = [
    "The plan for building the space, one version at a time.",
    "",
    ...ROADMAP.flatMap((milestone) => [
      `## Hacker Bloc ${milestone.version} — ${milestone.hackers} hackers`,
      "",
      milestone.summary,
      "",
      list([...milestone.items]),
      "",
    ]),
    "## Fund it",
    "",
    `Every version unlocks when enough hackers have joined; ten get us to 1.0. [Become a member](${url("/membership")}) or [see the wishlist](${url("/wishlist")}).`,
  ].join("\n");

  return doc("/roadmap", "Roadmap", body);
}

/* ── /wishlist ────────────────────────────────────────────────── */

function wishlistMarkdown(): string {
  const body = [
    "The things we want to build and buy next, with a way to fund specific items.",
    "",
    "## Items",
    "",
    "Coming soon.",
    "",
    "## Have something to give?",
    "",
    `Equipment, time, or resources? Tell us what you have in mind and we'll figure out how it can help the space. [Get in touch](mailto:${SITE.email}).`,
  ].join("\n");

  return doc("/wishlist", "Wishlist", body);
}

/* ── /members ─────────────────────────────────────────────────── */

/* Mirrors app/(site)/members/page.tsx. */
async function membersMarkdown(): Promise<string> {
  const people = await getPeople();
  const body = [
    "Everyone with a key to the Bloc. Founders run the house, residents live in it, members pay the membership, patrons put money in once, lurkers made an account and are thinking about it. Only GitHub usernames are shown.",
    "",
    "## The list",
    "",
    people === null
      ? "The list is offline right now."
      : people.length === 0
        ? "Nobody yet."
        : list(
            people.map((person) =>
              `${person.github ? `[${person.github}](https://github.com/${person.github})` : "anonymous"} — ${person.status}`,
            ),
          ),
    "",
    `Get on the list: ${url("/auth/sign-up")} · Become a member: ${url("/membership")}#member`,
  ].join("\n");
  return doc("/members", "Members", body);
}

/* ── /rules ────────────────────────────────────────────────────── */

async function rulesMarkdown(): Promise<string> {
  const [rules, houseRoles, members] = await Promise.all([
    getRules(),
    getHouseRoles(),
    getMembers(),
  ]);
  const ladder = authorityLadder(houseRoles, members);

  const sections: string[] = [
    "Read them before you show up. We are not a hostel, not a coworking, not a party flat — we are laser focused on building Hacklab.",
  ];

  if (ladder.length > 0) {
    sections.push(
      [
        "## The hierarchy",
        "",
        "Who decides, before what is decided — the rules below read differently once you know which rung you are standing on. Highest rung first.",
        "",
        ladder
          .map((step) => {
            const lines = [`### ${step.names.join(" / ")} — level ${step.level}`];
            if (step.responsibilities) lines.push("", step.responsibilities);
            if (step.members.length > 0) {
              lines.push("", `On this rung: ${step.members.join(", ")}.`);
            }
            return lines.join("\n");
          })
          .join("\n\n"),
      ].join("\n"),
    );
  }

  sections.push(
    [
      "## The rules",
      "",
      rules.length > 0
        ? ordered(rules)
        : "Rules are being written — ask hacker daddy.",
    ].join("\n"),
  );

  sections.push(
    `Applying means confirming you read this page: ${url("/join")}.`,
  );

  return doc("/rules", "House rules", sections.join("\n\n"));
}

/* ── /join ─────────────────────────────────────────────────────── */

/*
 * The form is a client component posting to a server action
 * (app/actions/join.ts), so there is nothing an agent can usefully submit from
 * here — what it needs is what the form asks and where the answers go.
 */
function joinMarkdown(): string {
  const body = [
    "Apply to the house. Ambitious founders only — we review every application.",
    "",
    `Use the form at ${url("/join")} to apply to the house. Emailing an application instead gets it read later, if at all.`,
    "",
    "## What the form asks",
    "",
    ordered([
      `**I am a** — one of: ${JOIN_TYPES.map((t) => t.label.toLowerCase()).join(", ")}.`,
      "**Name.**",
      "**Hacklab profile** — e.g. `hacklab.so/your-handle`.",
      "**How can you be useful to our community?** — skills, projects, intros; what you actually bring to the bloc.",
      "**How did you hear about our community?**",
      "**What are you most excited about?** — what would be the highest value we could give you.",
      `**Confirmation that you read the house rules** (${url("/rules")}). We want you to read them for real.`,
    ]),
    "",
    "## What happens to it",
    "",
    `Submissions land in our Notion CRM and are mirrored to a Postgres backup. We read everything. What is collected, how long it is kept, and how to have it deleted: ${url("/privacy")}`,
    "",
    "## Before you apply",
    "",
    list([
      `The house rules and the authority hierarchy: ${url("/rules")}`,
      `Questions that are not an application: ${SITE.email}`,
    ]),
  ].join("\n");

  return doc("/join", "Join", body);
}

/* ── /terms, /refunds ──────────────────────────────────────────── */

/*
 * Legal pages come from lib/legal.ts as data. Site-relative links become
 * absolute; the two mailto actions ("cancel", "withdraw") become the plain
 * address, since the pre-filled body only helps a human in a mail client.
 */
function legalMarkdown(legal: LegalDoc): string {
  const rewrite = (text: string) =>
    text.replace(/\]\(([^)]+)\)/g, (_, href: string) =>
      href.startsWith("/")
        ? `](${url(href)})`
        : `](mailto:${OPERATOR.email})`
    );
  const body = [
    `_Last updated ${legal.updated}._`,
    "",
    rewrite(legal.intro),
    "",
    ...legal.sections.flatMap((section) => [
      `## ${section.heading}`,
      "",
      ...section.paragraphs.flatMap((paragraph) => [rewrite(paragraph), ""]),
    ]),
    `Questions go to ${OPERATOR.email}.`,
  ].join("\n");
  return doc(legal.path, legal.title, body);
}

/* ── /privacy ──────────────────────────────────────────────────── */

function privacyMarkdown(): string {
  const body = [
    "Short version: the only personal data we collect is what you type into the join form and, if you pay, what Stripe needs to take the payment. We use it to read your application, to write back, and to run your membership. We don't sell it, we don't track you around the web, and you can have it deleted by asking.",
    "",
    "## What we collect",
    "",
    `The [join form](${url("/join")}) asks for: what you're applying as (founder, investor, media, content, factory, or partner), your name, your Hacklab profile, how you can be useful, how you heard about us, what excites you most, and a confirmation that you've read the house rules. That is the whole form. There are no hidden fields, and nothing else about you is captured when you submit it.`,
    "",
    "If you email us or book a call instead, we obviously end up with whatever you put in that email or booking. Same rules apply.",
    "",
    "## Where it goes",
    "",
    "Submissions are written to our Notion workspace, which is the CRM we review applications in, and mirrored into a Neon Postgres database as a backup so a Notion outage can't lose your application. The site itself runs on Vercel, so requests pass through Vercel's infrastructure on the way there. All three act as processors on our instructions, and all three are US providers — the backup database currently runs in a US region — so your data is transferred outside the EEA under their standard contractual clauses.",
    "",
    "Access is limited to the people in the house who review applications. We do not sell your data, we do not rent it, and we do not hand it to sponsors, partners, or anyone else for their own marketing.",
    "",
    "## Payments",
    "",
    `If you become a member or a patron, the checkout is hosted by Stripe. Stripe collects your name, email, billing address, and card details; the card number never reaches us. Stripe is an independent controller for the payment itself, under [its own privacy policy](https://stripe.com/privacy). What we receive from Stripe, and keep in the Neon Postgres database, is your name, email, Stripe customer and subscription ids, subscription status, and a record of each invoice paid (amount, currency, date). We use it to know who is a member, to let you in, and to keep the books.`,
    "",
    "The legal basis is performance of the membership contract, and for the payment records our legal obligation to keep accounting documents. Payment records are kept for five years after the end of the tax year in which the payment was made, as Polish tax law requires, even if you ask us to delete the rest.",
    "",
    "## Why we're allowed to",
    "",
    "You asked us to consider you. Under the GDPR, that's our legitimate interest in reviewing an application you sent us and contacting you about it — nothing more. We do not use the form to build a mailing list, and we won't send you unrelated broadcasts.",
    "",
    "Applicants are never published.",
    "",
    "## Tracking",
    "",
    "There is no analytics on this site. No Google Analytics, no Plausible, no PostHog, no pixels, no advertising tags, and no cookie banner, because we don't set cookies to track you. Fonts and event images are served from our own domain rather than fetched from someone else's, so loading a page here doesn't announce you to a third party. Links you click through to — the event calendar, the booking link, our social profiles — run under their own privacy policies, not ours.",
    "",
    "Our hosting provider keeps standard server logs (IP address, page requested, timestamp) for operational and security reasons, the way every web server does.",
    "",
    "## How long we keep it",
    "",
    "Until you ask us to delete it. Applications stay in the CRM because the house is a long game — someone who was too early in spring is often exactly right by autumn, and we'd rather re-read your application than make you rewrite it. If you'd rather not be on that list, say so and you're off it.",
    "",
    "## Your rights",
    "",
    `You can ask for a copy of what we hold on you, ask us to correct it, ask us to delete it, or object to us holding it at all. Email ${SITE.email} from the address you applied with — or tell us which address to look for — and we'll handle it, from both Notion and the Postgres backup, within 30 days. No form, no fee, no argument.`,
    "",
    "If we get it wrong, you can complain to your local data protection authority; in Poland that is the President of the Personal Data Protection Office (UODO). We'd rather you told us first.",
    "",
    `Questions about any of this go to the same address as everything else: ${SITE.email}`,
  ].join("\n");

  return doc("/privacy", "Privacy", body);
}

/* ── 404 ───────────────────────────────────────────────────────── */

/*
 * The markdown half of the branded 404 in app/not-found.tsx. An agent that
 * guessed a URL wrong needs one line telling it so and the shortest path back
 * to something real — the two machine-readable maps first, then the rooms that
 * do exist.
 */
export function markdownNotFound(pathname: string): string {
  const requested = normalizePath(pathname);

  return [
    `# ${SITE.name} — 404`,
    "",
    `> No such page: ${requested}. Nothing lives at this address.`,
    `> Agent guide: ${LLMS_TXT} · Sitemap: ${SITEMAP}`,
    "",
    "---",
    "",
    "## Try instead",
    "",
    list([
      `[Home](${url("/")}) — a space for people who build`,
      `[Events](${url("/events")}) — upcoming and recent events`,
      `[Membership](${url("/membership")}) — founding membership, benefits, pricing, and payment availability`,
      `[Wishlist](${url("/wishlist")}) — what the space needs next, and how to give equipment or time`,
      `[Members](${url("/members")}) — everyone with an account: members, patrons, lurkers`,
      `[Rules](${url("/rules")}) — who decides what, and the house rules`,
      `[Join](${url("/join")}) — apply to the house`,
      `[Terms](${url("/terms")}) — membership terms`,
      `[Refunds](${url("/refunds")}) — cancellation, withdrawal, and refunds`,
      `[Privacy](${url("/privacy")}) — what the join form and checkout collect`,
    ]),
    "",
    `Every page above serves this same markdown when asked with \`Accept: text/markdown\`.`,
    "",
  ].join("\n");
}
