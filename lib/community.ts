/** Shared community / join applicant types */

/*
 * A community tab, sourced from the Notion "community roles" data source (see
 * getCommunityRoles in lib/notion.ts). `id` is the role's Notion page id, which
 * is what member rows relate to.
 *
 * `name` is the tab label and the heading of that role's section in the
 * everyone view. `cardLabel` is the shorter singular ("hacker bloc" / "Core"),
 * now worn by placeholder cards only: a real member's card states their rank in
 * the house instead, since which tab someone sits on is the tab's business.
 * Both render through `uppercase`, so the CRM's casing does not matter.
 */
export type CommunityRole = {
  id: string;
  name: string;
  cardLabel: string;
  description: string | null;
  /* How many placeholder cards to draw while the role has no members yet. */
  placeholders: number;
};

/*
 * The rank a member holds in the house, and the badge they wear for it. These
 * come from the Notion "roles in the house" data source (see getHouseRoles in
 * lib/notion.ts) and are orthogonal to CommunityRole above — a house role never
 * makes a tab, it says what someone *is* on the tabs they are already on.
 *
 * Every name and number here is the CRM's to change: roles get renamed and
 * re-levelled, so nothing downstream may hardcode either.
 *
 * Only rows with "Show on site" checked ever reach this type; the data source
 * holds internal roles too, and those must not leak onto the site.
 */
/*
 * The ranking half of a house role, with no name attached — deliberately.
 *
 * The authority buckets on /community have to weigh roles the site keeps
 * private ("Show on site" unchecked), so getHouseRoleLevels in lib/notion.ts
 * reads the whole data source down to this shape: an id to match a member's
 * relation against and a number to compare. Nothing here can be rendered, so
 * nothing here can leak a private role's name onto the page.
 */
export type HouseRoleLevel = {
  id: string;
  /*
   * Authority in the house, low number to high. `null` for the roles the CRM
   * leaves unranked — those still badge a member, they just carry no level and
   * never appear on the ladder.
   */
  level: number | null;
};

export type HouseRole = HouseRoleLevel & {
  name: string;
  /* "Responsibilities" — what the rung is on the hook for. */
  responsibilities: string | null;
};

/*
 * One rung of the authority ladder. Roles that share a level share a rung, so a
 * step holds a list of names and merged copy rather than one role's.
 */
export type LadderStep = {
  level: number;
  /* Role names on this rung, in `houseRoles` order. */
  names: string[];
  /* Merged across the rung's roles; null when none of them fill it in. */
  responsibilities: string | null;
  /*
   * The site-visible people standing on this rung, in authority order. Someone
   * holding two rungs is named on both — that is the point of a ladder you can
   * be part-way up. Empty is normal: most rungs have nobody on them yet.
   */
  members: string[];
};

/*
 * Merges one role's copy into a rung's. Roles that share a level often share
 * wording too ("Appointed."), and printing it twice would read as a rendering
 * bug — so identical copy collapses and genuinely different copy is joined
 * rather than one silently winning.
 */
function mergeCopy(current: string | null, next: string | null): string | null {
  if (!next) return current;
  if (!current) return next;
  return current.includes(next) ? current : `${current} · ${next}`;
}

/*
 * The ladder, from the public house roles that carry a Level, top rung first —
 * the house reads its own hierarchy downwards. Unranked roles are dropped
 * rather than piled into a trailing "no level" rung: the ladder is about
 * climbing, and a rung nobody can name a number for says nothing.
 *
 * `members` is who is standing on each rung, resolved through the same relation
 * the badges use, so the ladder and the cards can never disagree.
 *
 * Returns [] when there are no ranked roles at all (no NOTION_TOKEN, Notion
 * unreachable), which is what tells the page to render its plain intro instead.
 */
export function authorityLadder(
  houseRoles: readonly HouseRole[],
  members: readonly Member[] = []
): LadderStep[] {
  const steps: LadderStep[] = [];
  const byLevel = new Map<number, LadderStep>();
  /* Role ids per rung, so a member holding two roles on one rung is named once. */
  const roleIds = new Map<number, Set<string>>();

  for (const role of houseRoles) {
    if (role.level === null) continue;
    let step = byLevel.get(role.level);
    if (!step) {
      step = {
        level: role.level,
        names: [],
        responsibilities: null,
        members: [],
      };
      byLevel.set(role.level, step);
      roleIds.set(role.level, new Set());
      steps.push(step);
    }
    step.names.push(role.name);
    step.responsibilities = mergeCopy(
      step.responsibilities,
      role.responsibilities
    );
    roleIds.get(role.level)?.add(role.id);
  }

  for (const member of sortByAuthority([...members], houseRoles)) {
    for (const step of steps) {
      const ids = roleIds.get(step.level);
      if (member.houseRoleIds.some((id) => ids?.has(id))) {
        step.members.push(member.name);
      }
    }
  }

  steps.sort((a, b) => b.level - a.level);
  return steps;
}

/*
 * Fallback tabs for when Notion is unreachable or NOTION_TOKEN is absent (local
 * dev, preview builds): getCommunityRoles() returns [] and the page renders
 * this list with placeholder cards instead, exactly as it did before roles
 * became data. The ids are local slugs — no member ever relates to them, so
 * every fallback tab is placeholders-only by construction.
 */
export const COMMUNITY_TABS: readonly CommunityRole[] = [
  { id: "hackers", name: "Hackers", cardLabel: "Hacker", description: null, placeholders: 6 },
  { id: "founders", name: "Founders", cardLabel: "Founder", description: null, placeholders: 9 },
  { id: "media", name: "Media", cardLabel: "Media", description: null, placeholders: 6 },
  { id: "investors", name: "Investors", cardLabel: "Investor", description: null, placeholders: 6 },
  { id: "factories", name: "Factories", cardLabel: "Factory", description: null, placeholders: 6 },
  { id: "partners", name: "Partners", cardLabel: "Partner", description: null, placeholders: 9 },
];

/** Types people can select when applying (not core house team). */
export const JOIN_TYPES = [
  { value: "hacker", label: "Hacker" },
  { value: "founder", label: "Founder" },
  { value: "media", label: "Media" },
  { value: "investor", label: "Investor" },
  { value: "factory", label: "Factory" },
  { value: "partner", label: "Partner" },
] as const;

export type JoinType = (typeof JOIN_TYPES)[number]["value"];

export const JOIN_TYPE_VALUES = JOIN_TYPES.map((t) => t.value) as readonly JoinType[];

export function isJoinType(v: string): v is JoinType {
  return (JOIN_TYPE_VALUES as readonly string[]).includes(v);
}

/*
 * A person shown in the community grid, sourced from the Notion members CRM
 * (see lib/notion.ts). The type lives here rather than in lib/notion.ts so the
 * client-side tabs can import it without dragging the Notion module — and the
 * NOTION_TOKEN read inside it — into the browser bundle.
 */
export type MemberStatus = "active" | "alumni";

export type Member = {
  id: string;
  name: string;
  /*
   * Notion page ids of the roles this member holds. Plural on purpose: someone
   * can be both core team and a founder, and then appears under both tabs.
   * A member with none sits on no by-type tab at all — they are only on the
   * page if a house role puts them in an authority bucket (see getMembers).
   */
  roleIds: string[];
  /*
   * Notion page ids of the house roles this member holds, straight from the
   * relation. Ids of roles hidden from the site are in here too — resolving
   * them against the public list (houseRoleNames) is what filters them out.
   */
  houseRoleIds: string[];
  photoUrl: string | null;
  /** The member's own site. Their Hacklab page is `hacklabProfile`. */
  link: string | null;
  hacklabProfile: string | null;
  building: string | null;
  status: MemberStatus;
  /*
   * "How can I help?" profile — every field below is optional in the CRM, so a
   * member can have none of it. The card opens the profile panel either way;
   * the panel simply renders fewer sections.
   *
   * `communityRoles` are the panel's chips, from the Notion "Brings to the
   * table" multi-select (mentorship, intros, space…). Despite the name they are
   * unrelated to `roleIds` above: they say what the member offers, not which
   * tab they sit on.
   */
  communityRoles: string[];
  howCanIHelp: string | null;
  howToGetHelp: string | null;
  howNotToGetHelp: string | null;
  email: string | null;
  bookingLink: string | null;
};

/*
 * The member's public house-role badges, for the card badge line and the
 * profile chips. Ids that aren't in `houseRoles` — internal roles, or a role
 * unchecked in the CRM since the member was last edited — are dropped silently,
 * so a member can hold house roles and still show no badges.
 *
 * Titles only — the level number orders them and is spelled out on the ladder
 * (/rules), but a card says who someone is, not what number they are.
 *
 * Highest rung first, unranked roles last: the badge line is the card's role
 * line, and it should open with what the member *is* rather than with the
 * lowest thing they happen to hold.
 */
export function houseRoleBadges(
  member: Member,
  houseRoles: readonly HouseRole[]
): string[] {
  if (member.houseRoleIds.length === 0) return [];
  const held = new Set(member.houseRoleIds);
  return houseRoles
    .filter((role) => held.has(role.id))
    .sort((a, b) => {
      if (a.level === b.level) return a.name.localeCompare(b.name);
      if (a.level === null) return 1;
      if (b.level === null) return -1;
      return b.level - a.level;
    })
    .map((role) => role.name);
}

/*
 * How much say a member has in the house: the highest level among the house
 * roles they hold that appear in `houseRoles`, or null when none of them is
 * ranked there.
 *
 * The list passed in decides what counts. Every grid and the ladder pass the
 * *public* roles, so a member whose only house role is hidden from the site
 * ranks as unknown and the page never orders people by something it refuses to
 * show. The authority buckets pass the full leveled list instead (see
 * groupMembersByAuthority) — they have to weigh private roles to bucket at all,
 * and they render no role name to leak.
 */
export function memberLevel(
  member: Member,
  houseRoles: readonly HouseRoleLevel[]
): number | null {
  if (member.houseRoleIds.length === 0) return null;
  const held = new Set(member.houseRoleIds);
  let top: number | null = null;
  for (const role of houseRoles) {
    if (role.level === null || !held.has(role.id)) continue;
    if (top === null || role.level > top) top = role.level;
  }
  return top;
}

/*
 * Authority order: highest level first, unranked members last, name-ascending
 * within a level. Sorts in place and returns the same array — callers pass the
 * freshly built buckets from groupMembersByRole.
 */
export function sortByAuthority(
  members: Member[],
  houseRoles: readonly HouseRoleLevel[]
): Member[] {
  /* Resolve once per member: the comparator runs O(n log n) times. */
  const level = new Map(members.map((m) => [m.id, memberLevel(m, houseRoles)]));
  /* Unranked sorts below every real level, whatever the CRM puts in the column. */
  const rank = (m: Member) => level.get(m.id) ?? Number.NEGATIVE_INFINITY;
  return members.sort(
    (a, b) => rank(b) - rank(a) || a.name.localeCompare(b.name)
  );
}

/** Members bucketed by role id. Keys are exactly the ids of the roles passed in. */
export type MembersByRole = Record<string, Member[]>;

/*
 * Buckets members under every role they hold, so a member with two roles shows
 * up on both tabs. Roles the member relates to but that aren't in `roles` —
 * hidden ones like "hackers", or a role unchecked in the CRM since the member
 * was last edited — are dropped rather than creating a tabless bucket.
 *
 * Every bucket comes out in authority order. Sorting here rather than at each
 * render site is what makes "highest level first" true everywhere members are
 * drawn — the tab grids and the everyone view read the same buckets.
 */
export function groupMembersByRole(
  members: Member[],
  roles: readonly CommunityRole[],
  houseRoles: readonly HouseRole[]
): MembersByRole {
  const grouped: MembersByRole = Object.fromEntries(
    roles.map((role) => [role.id, [] as Member[]])
  );
  for (const member of members) {
    for (const roleId of member.roleIds) {
      grouped[roleId]?.push(member);
    }
  }
  for (const bucket of Object.values(grouped)) {
    sortByAuthority(bucket, houseRoles);
  }
  return grouped;
}

/* ── the other way of slicing the room: by authority ───────────── */

/*
 * A tab in the authority filter row. It is a CommunityRole so it can drive the
 * exact same tab row, heading, and placeholder grid as a Notion role — the two
 * rows differ in what fills their buckets, not in how a bucket looks.
 *
 * The extra pair is the bucketing rule: a level range, never a role name.
 * "Resident", "Goblin" and the rest are the CRM's to rename at any time, and a
 * rename must not silently empty a tab; a level is what the house actually
 * ranks by. `maxLevel` is inclusive, `null` meaning open-ended at the top.
 */
export type AuthorityBucket = CommunityRole & {
  minLevel: number;
  maxLevel: number | null;
};

/*
 * The three rungs the site groups people into, top first. Fixed display names:
 * they are the site's own vocabulary rather than any Notion row's title, which
 * is also what makes it safe to bucket by roles that are private — a private
 * role can put someone in MEMBERS without ever printing its name.
 *
 * Residents deliberately swallows everything at level 3 and up (today: Hacklab
 * team, Resident, Guest, House mommy, House daddy). The house's own hierarchy
 * lives on /rules; here they are all simply the people who hold the place up.
 * Raise `minLevel` below to split the upper rungs back out into their own tab.
 *
 * Levels 0 and unranked (today: "Randoms") match no bucket at all — someone has
 * to be at least an online member to be part of the community page.
 */
export const AUTHORITY_BUCKETS: readonly AuthorityBucket[] = [
  {
    id: "authority-residents",
    name: "Residents",
    cardLabel: "Resident",
    description:
      "The people who hold the place up — residents, house team, and everyone above them.",
    placeholders: 6,
    minLevel: 3,
    maxLevel: null,
  },
  {
    id: "authority-goblins",
    name: "Goblins",
    cardLabel: "Goblin",
    description:
      "Regulars around the bloc — here often enough that the house knows their name.",
    placeholders: 6,
    minLevel: 2,
    maxLevel: 2,
  },
  /*
   * "Members", not "hackers": the community roles already have a hacker tab in
   * the row underneath, and two different meanings of the same word one line
   * apart is a filter nobody can read.
   */
  {
    id: "authority-members",
    name: "Members",
    cardLabel: "Member",
    description:
      "The online community — members who orbit the bloc from wherever they are.",
    placeholders: 6,
    minLevel: 1,
    maxLevel: 1,
  },
];

/*
 * Members bucketed by authority rung, keyed by bucket id — same shape as
 * groupMembersByRole so the tabs can swap one map for the other.
 *
 * `levels` must be the *full* leveled list (getHouseRoleLevels), private roles
 * included: someone whose only house role is kept off the site still belongs in
 * a bucket, and dropping them would make the row quietly lose people.
 *
 * A member lands in exactly ONE bucket — the one their highest rung falls in.
 * Authority is a rank, not a collection: a goblin who is also on the
 * online-members list is a goblin, full stop. Each bucket comes out in
 * authority order like every other grid.
 */
export function groupMembersByAuthority(
  members: readonly Member[],
  levels: readonly HouseRoleLevel[],
  buckets: readonly AuthorityBucket[] = AUTHORITY_BUCKETS
): MembersByRole {
  const levelById = new Map<string, number>();
  for (const role of levels) {
    if (role.level !== null) levelById.set(role.id, role.level);
  }

  const grouped: MembersByRole = Object.fromEntries(
    buckets.map((bucket) => [bucket.id, [] as Member[]])
  );

  for (const member of members) {
    const held = member.houseRoleIds
      .map((id) => levelById.get(id))
      .filter((level): level is number => level !== undefined);
    if (held.length === 0) continue;
    const top = Math.max(...held);
    const bucket = buckets.find(
      (b) => top >= b.minLevel && (b.maxLevel === null || top <= b.maxLevel)
    );
    if (bucket) grouped[bucket.id].push(member);
  }

  for (const bucket of Object.values(grouped)) {
    sortByAuthority(bucket, levels);
  }
  return grouped;
}
