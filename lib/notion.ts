import {
  type CommunityRole,
  type HouseRole,
  type HouseRoleLevel,
  type JoinType,
  type Member,
  type MemberStatus,
} from "@/lib/community";

/*
 * Server-side reads/writes against the Notion REST API — Notion is the CRM/CMS
 * behind the community grid, the house rules, and the join form.
 *
 * Server-only by construction: every export touches NOTION_TOKEN, so this file
 * must never be imported from a "use client" module. Shared *types* live in
 * lib/community.ts precisely so client components can import them without
 * pulling this module into the browser bundle.
 *
 * Every read degrades to an empty result and every write degrades to `false`:
 * NOTION_TOKEN is absent in local dev and in preview builds, and a missing
 * token must never break a page render or a form submission.
 */

const NOTION_API = "https://api.notion.com/v1";

/*
 * 2025-09-03 is the first version with first-class data sources: rows are
 * queried at /data_sources/{id}/query and created with a
 * parent.type = "data_source_id". Older versions use /databases/{id}/query.
 */
const NOTION_VERSION = "2025-09-03";

/*
 * Notion-hosted file URLs (member photos) are pre-signed and expire after
 * ~1 hour, so any cache entry holding them has to be shorter-lived than that.
 * 300s also keeps CRM edits visible on the site within ~5 minutes.
 *
 * Mechanism: Cache Components (`use cache` / cacheLife) is a Next 16 opt-in via
 * `cacheComponents: true` in next.config.ts, which this app has not enabled, so
 * the applicable model is the fetch Data Cache — `next: { revalidate }` — the
 * same idiom lib/luma.ts already uses. Next keys POST fetches on the request
 * body, so the two queries below cache independently.
 */
const REVALIDATE_SECONDS = 300;

const DATA_SOURCES = {
  members: "9748141c-8768-4c7d-be11-985276768357",
  communityRoles: "84704b1d-e35c-4919-a826-9de0591c264c",
  houseRoles: "501a4119-f22c-4b19-a775-97a20d12297f",
  rules: "b96035f7-ca5e-427a-af8f-7580ddba8f4f",
  applications: "743c4ce6-0bb8-45db-861f-1c28945c3461",
} as const;

/*
 * Placeholder cards drawn for a Notion role nobody has been assigned to yet.
 * The static fallback tabs carry their own per-tab counts (lib/community.ts);
 * a role invented in the CRM has no such history, so it gets one grid row on
 * the widest breakpoint.
 */
const PLACEHOLDERS_PER_ROLE = 6;

/* ── raw Notion shapes (only the bits we read) ─────────────────── */

type RichTextItem = { plain_text?: string };

type FileItem =
  | { type?: "file"; file?: { url?: string }; external?: { url?: string } }
  | { type?: "external"; external?: { url?: string }; file?: { url?: string } };

type NotionProperty = {
  type?: string;
  title?: RichTextItem[];
  rich_text?: RichTextItem[];
  select?: { name?: string } | null;
  multi_select?: { name?: string }[];
  files?: FileItem[];
  relation?: { id?: string }[];
  url?: string | null;
  checkbox?: boolean;
  number?: number | null;
  email?: string | null;
};

type NotionPage = {
  id?: string;
  properties?: Record<string, NotionProperty | undefined>;
};

/* ── property readers ──────────────────────────────────────────── */

function plainText(items: RichTextItem[] | undefined): string {
  if (!Array.isArray(items)) return "";
  return items
    .map((i) => i?.plain_text ?? "")
    .join("")
    .trim();
}

function readTitle(props: NotionPage["properties"], key: string): string {
  return plainText(props?.[key]?.title);
}

function readRichText(props: NotionPage["properties"], key: string): string {
  return plainText(props?.[key]?.rich_text);
}

function readSelect(
  props: NotionPage["properties"],
  key: string
): string | null {
  const name = props?.[key]?.select?.name;
  return name ? name.trim() : null;
}

function readMultiSelect(
  props: NotionPage["properties"],
  key: string
): string[] {
  const options = props?.[key]?.multi_select;
  if (!Array.isArray(options)) return [];
  return options
    .map((o) => o?.name?.trim() ?? "")
    .filter((name) => name.length > 0);
}

/*
 * A relation comes back as an array of `{ id }` page refs. Notion truncates it
 * at 25 entries and exposes the rest behind a separate property-item request —
 * irrelevant here, since a member holds a handful of roles at most.
 */
function readRelationIds(
  props: NotionPage["properties"],
  key: string
): string[] {
  const relation = props?.[key]?.relation;
  if (!Array.isArray(relation)) return [];
  return relation
    .map((r) => r?.id ?? "")
    .filter((id) => id.length > 0);
}

function readNumber(
  props: NotionPage["properties"],
  key: string
): number | null {
  const value = props?.[key]?.number;
  /* An empty Notion number cell answers `null`; only a real number is a level. */
  return typeof value === "number" ? value : null;
}

function readEmail(props: NotionPage["properties"], key: string): string | null {
  const email = props?.[key]?.email;
  return email ? email.trim() : null;
}

function readUrl(props: NotionPage["properties"], key: string): string | null {
  const url = props?.[key]?.url;
  return url ? url.trim() : null;
}

function readFirstFileUrl(
  props: NotionPage["properties"],
  key: string
): string | null {
  const files = props?.[key]?.files;
  if (!Array.isArray(files)) return null;
  for (const f of files) {
    const url = f?.file?.url ?? f?.external?.url;
    if (url) return url;
  }
  return null;
}

/* Paused members are hidden; banned members are hidden and never linked. */
const VISIBLE_STATUSES: readonly string[] = ["active", "alumni"];

/* ── request plumbing ──────────────────────────────────────────── */

function notionHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

async function queryDataSource(
  dataSourceId: string,
  body: Record<string, unknown>
): Promise<NotionPage[]> {
  const token = process.env.NOTION_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(`${NOTION_API}/data_sources/${dataSourceId}/query`, {
      method: "POST",
      headers: notionHeaders(token),
      body: JSON.stringify({ page_size: 100, ...body }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: NotionPage[] };
    return Array.isArray(data.results) ? data.results : [];
  } catch {
    return [];
  }
}

/* ── community roles ───────────────────────────────────────────── */

/*
 * The community tabs, in CRM order. Roles with "Show on site" unchecked (today:
 * "hackers") get no tab, and members holding only such a role drop off the grid
 * — groupMembersByRole buckets against this list alone.
 *
 * Returns [] without a token or on any failure; the page then falls back to the
 * static COMMUNITY_TABS.
 */
export async function getCommunityRoles(): Promise<CommunityRole[]> {
  const pages = await queryDataSource(DATA_SOURCES.communityRoles, {
    filter: { property: "Show on site", checkbox: { equals: true } },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  const roles: CommunityRole[] = [];
  for (const page of pages) {
    const props = page.properties;
    const name = readTitle(props, "Name");
    /* No id means no member can relate to it, and no name means no tab label. */
    if (!page.id || !name) continue;

    roles.push({
      id: page.id,
      name,
      /* An empty "Card label" falls back to the tab name rather than a blank line. */
      cardLabel: readRichText(props, "Card label") || name,
      description: readRichText(props, "Description") || null,
      placeholders: PLACEHOLDERS_PER_ROLE,
    });
  }
  return roles;
}

/* ── house roles ───────────────────────────────────────────────── */

/*
 * The badges a member can wear on the site — "House daddy", "Resident",
 * "Goblin"… Unlike the community roles these make no tabs, but they do carry
 * "Level", the house's authority ranking (0 stranger … 5 house daddy), which
 * both orders the badges and draws the ladder on the community page.
 *
 * Sorted by level ascending with the unranked roles last, then by name, since
 * the CRM has no order column: the ladder and every badge line then read the
 * same way regardless of what order Notion answers in.
 *
 * The data source also holds roles kept off the site; the "Show on site" filter
 * is the only thing standing between them and the public grid, so members'
 * relations are never trusted to be public on their own (see houseRoleBadges).
 *
 * Returns [] without a token or on any failure — no badges, no ladder, no
 * authority ordering, and nothing else about the community page changes.
 */
export async function getHouseRoles(): Promise<HouseRole[]> {
  const pages = await queryDataSource(DATA_SOURCES.houseRoles, {
    filter: { property: "Show on site", checkbox: { equals: true } },
  });

  const roles: HouseRole[] = [];
  for (const page of pages) {
    const props = page.properties;
    const name = readTitle(props, "Name");
    /* No id means no member relation can match it; no name means no badge. */
    if (!page.id || !name) continue;
    roles.push({
      id: page.id,
      name,
      level: readNumber(props, "Level"),
      responsibilities: readRichText(props, "Responsibilities") || null,
    });
  }

  roles.sort((a, b) => {
    /* Unranked roles land after every ranked one rather than ahead of level 0. */
    if (a.level !== b.level) {
      if (a.level === null) return 1;
      if (b.level === null) return -1;
      return a.level - b.level;
    }
    return a.name.localeCompare(b.name);
  });
  return roles;
}

/*
 * Every house role's level, private rows included — id and number only.
 *
 * The authority buckets on /community (groupMembersByAuthority) have to rank
 * roles the site does not show: a member whose only house role is kept off the
 * site is still an online community member, and getHouseRoles above would drop
 * them out of every bucket. So this reads the data source unfiltered.
 *
 * Names are deliberately not read. The bucket labels are the site's own fixed
 * words, so nothing downstream ever needs a private role's title — and what is
 * never loaded can never be rendered by accident.
 *
 * Next keys the fetch Data Cache on the POST body, so this unfiltered query
 * caches separately from getHouseRoles' filtered one rather than clobbering it.
 *
 * Returns [] without a token or on any failure; the authority filter row then
 * hides and /community is the by-type tabs it has always been.
 */
export async function getHouseRoleLevels(): Promise<HouseRoleLevel[]> {
  const pages = await queryDataSource(DATA_SOURCES.houseRoles, {});

  const levels: HouseRoleLevel[] = [];
  for (const page of pages) {
    /* No id means no member relation can match it, so it can rank nobody. */
    if (!page.id) continue;
    levels.push({ id: page.id, level: readNumber(page.properties, "Level") });
  }
  return levels;
}

/* ── members ───────────────────────────────────────────────────── */

export async function getMembers(): Promise<Member[]> {
  const pages = await queryDataSource(DATA_SOURCES.members, {
    filter: { property: "Show on site", checkbox: { equals: true } },
  });

  const members: Member[] = [];
  for (const page of pages) {
    const props = page.properties;
    const name = readTitle(props, "Name");
    /*
     * Which tabs a member appears under. The old "Type" select still exists in
     * the CRM but is being retired — it is deliberately not read here.
     */
    const roleIds = readRelationIds(props, "Community roles");
    /*
     * Badges, not tabs — but also the authority buckets' only input, which is
     * why a member with no community role is no longer dropped below.
     */
    const houseRoleIds = readRelationIds(props, "House roles");
    const status = (readSelect(props, "Status") ?? "").toLowerCase();

    /*
     * A member needs somewhere to land: a community role puts them on a by-type
     * tab, a house role puts them in an authority bucket. With neither there is
     * no view that would draw them, so they are skipped entirely. (Community
     * roles alone used to be the test, back when the by-type tabs were the only
     * filter; requiring them now would empty the authority row, since the CRM
     * ranks people in the house long before it files them under a tab.)
     */
    if (!name || (roleIds.length === 0 && houseRoleIds.length === 0)) continue;
    if (!VISIBLE_STATUSES.includes(status)) continue;

    members.push({
      id: page.id ?? `${roleIds[0] ?? houseRoleIds[0]}-${name}`,
      name,
      roleIds,
      houseRoleIds,
      photoUrl: readFirstFileUrl(props, "Photo"),
      /*
       * Kept apart rather than falling back one to the other: the profile panel
       * labels them differently ("Hacklab profile" vs the member's own link),
       * and a fallback would render the same URL under both labels.
       */
      link: readUrl(props, "Link"),
      hacklabProfile: readUrl(props, "Hacklab profile"),
      building: readRichText(props, "Building") || null,
      status: status as MemberStatus,
      communityRoles: readMultiSelect(props, "Brings to the table"),
      howCanIHelp: readRichText(props, "How can I help") || null,
      howToGetHelp: readRichText(props, "How to get help") || null,
      howNotToGetHelp: readRichText(props, "How not to get help") || null,
      email: readEmail(props, "Email"),
      bookingLink: readUrl(props, "Booking link"),
    });
  }

  members.sort((a, b) => a.name.localeCompare(b.name));
  return members;
}

/* ── house rules ───────────────────────────────────────────────── */

export async function getRules(): Promise<string[]> {
  const pages = await queryDataSource(DATA_SOURCES.rules, {
    filter: { property: "Show on site", checkbox: { equals: true } },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return pages
    .map((page) => readTitle(page.properties, "Rule"))
    .filter((rule) => rule.length > 0);
}

/* ── applications ──────────────────────────────────────────────── */

export type ApplicationInput = {
  name: string;
  email: string;
  type: JoinType;
  building: string;
  links: string;
};

function richTextValue(value: string) {
  /* Notion rejects rich_text items longer than 2000 chars. */
  return value ? [{ text: { content: value.slice(0, 2000) } }] : [];
}

/** Creates an application row. Resolves `false` instead of throwing. */
export async function createApplication(
  input: ApplicationInput
): Promise<boolean> {
  const token = process.env.NOTION_TOKEN;
  if (!token) return false;

  try {
    const res = await fetch(`${NOTION_API}/pages`, {
      method: "POST",
      headers: notionHeaders(token),
      cache: "no-store",
      body: JSON.stringify({
        parent: {
          type: "data_source_id",
          data_source_id: DATA_SOURCES.applications,
        },
        properties: {
          Name: { title: richTextValue(input.name) },
          Email: { email: input.email },
          Type: { select: { name: input.type } },
          Building: { rich_text: richTextValue(input.building) },
          Links: { rich_text: richTextValue(input.links) },
          Stage: { select: { name: "new" } },
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
