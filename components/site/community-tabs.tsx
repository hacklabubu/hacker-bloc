"use client";

import { useState } from "react";
import { MemberProfile } from "@/components/site/member-profile";
import {
  houseRoleBadges,
  type CommunityRole,
  type HouseRole,
  type Member,
  type MembersByRole,
} from "@/lib/community";

const CARD =
  "flex flex-col border border-border bg-asphalt text-left transition-colors hover:border-signal";

/*
 * The card opens the member's profile panel rather than linking out: their own
 * link now lives inside the panel, next to the rest of the "how can I help?"
 * material. Every real member card is clickable, even one with nothing beyond
 * the grid basics — the panel then shows the header block alone.
 */
function MemberCard({
  member,
  badges,
  chips,
  onOpen,
}: {
  member: Member;
  /*
   * The member's rank in the house — the card's role line. Deliberately the
   * only role a card states: which tab someone sits on is the tab's business,
   * and repeating it on every card said nothing the heading above had not.
   * Empty for a member with no public house role, who then shows none.
   */
  badges: string[];
  /* Community-role tags — what they do (Hacker, Content, …), worn as chips. */
  chips: string[];
  onOpen: () => void;
}) {
  return (
    <button type="button" onClick={onOpen} className={CARD}>
      <div
        className="flex items-center justify-center overflow-hidden bg-charcoal"
        style={{ aspectRatio: "1/1" }}
      >
        {member.photoUrl ? (
          /*
           * Plain <img>, not next/image: photos come from Notion on whatever
           * host the CRM happens to use (pre-signed S3 today, arbitrary
           * external URLs when someone pastes a link), and next/image requires
           * every hostname to be enumerated in images.remotePatterns. Locking
           * that list down enough to be safe would make member photos silently
           * 500 whenever Notion changes storage hosts.
           */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[10px] tracking-[0.25em] text-steel uppercase">
            {member.name.slice(0, 2)}
          </span>
        )}
      </div>
      <div className="border-t border-border px-5 py-4">
        <p className="text-sm font-bold tracking-widest text-beige uppercase">
          {member.name}
        </p>
        {/*
         * One line rather than chips: the grid is dense and a row of bordered
         * boxes under every name would fight the photos for attention.
         */}
        {badges.length > 0 && (
          <p className="mt-1 text-xs tracking-[0.2em] text-concrete uppercase">
            {badges.join(" · ")}
          </p>
        )}
        {chips.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li
                key={chip}
                className="border border-steel px-2.5 py-1 text-[11px] tracking-[0.2em] text-signal uppercase"
              >
                {chip}
              </li>
            ))}
          </ul>
        )}
        {member.building && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-steel">
            {member.building}
          </p>
        )}
      </div>
    </button>
  );
}

function PlaceholderCard({ role }: { role: string }) {
  return (
    <div className="flex flex-col border border-dashed border-border bg-asphalt">
      <div
        className="flex items-center justify-center bg-charcoal"
        style={{ aspectRatio: "1/1" }}
      >
        <span className="text-[10px] tracking-[0.25em] text-steel uppercase">
          photo
        </span>
      </div>
      <div className="border-t border-border px-5 py-4">
        <p className="text-sm font-bold tracking-widest text-beige uppercase">
          Name
        </p>
        <p className="mt-1 text-xs tracking-[0.2em] text-concrete uppercase">
          {role}
        </p>
      </div>
    </div>
  );
}

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

const TAB = "font-bold tracking-[0.2em] uppercase transition-colors";
/*
 * Two filter rows, two looks. The authority row is the loud one — signal green,
 * full size — because it is the ranking the whole page is sorted by; the type
 * row underneath is smaller and answers in bone rather than green. Reading them
 * as one long row of identical buttons would hide the fact that they are two
 * independent dimensions that combine.
 */
const TONE = {
  primary: {
    size: "px-4 py-2.5 text-xs sm:text-sm",
    on: "bg-signal text-on-signal",
    off: "border border-border text-concrete hover:border-beige hover:text-beige",
  },
  secondary: {
    size: "px-3 py-2 text-[10px] sm:text-xs",
    on: "bg-beige text-charcoal",
    off: "border border-border text-concrete hover:border-beige hover:text-beige",
  },
} as const;

/*
 * One filter dimension. `selectedId` is null for the row's neutral "All", which
 * is what lets the other row filter on its own — and both rows neutral is the
 * everyone view.
 *
 * The row is labelled for screen readers only: the two dimensions are legible
 * on sight from their contents and weights, and captioning them ("filter by…")
 * would put more chrome on the page than the filters themselves.
 */
function FilterRow({
  label,
  tabs,
  selectedId,
  onSelect,
  tone,
  showAll = true,
}: {
  label: string;
  tabs: readonly CommunityRole[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  tone: keyof typeof TONE;
  /* Dropped when there is nobody to show under it — see `anyMembers`. */
  showAll?: boolean;
}) {
  const style = TONE[tone];
  const button = (id: string | null, name: string) => {
    const selected = selectedId === id;
    return (
      <button
        key={id ?? "all"}
        type="button"
        role="tab"
        aria-selected={selected}
        onClick={() => onSelect(id)}
        className={`${TAB} ${style.size} ${selected ? style.on : style.off}`}
      >
        {name}
      </button>
    );
  };

  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {showAll && button(null, "All")}
      {tabs.map((tab) => button(tab.id, tab.name))}
    </div>
  );
}

export function CommunityTabs({
  roles,
  membersByRole,
  authorityBuckets,
  membersByAuthority,
  houseRoles,
}: {
  /* Notion's community roles, in CRM order, or the static fallback tabs. */
  roles: readonly CommunityRole[];
  /* Buckets in authority order — see groupMembersByRole. */
  membersByRole: MembersByRole;
  /*
   * The authority rungs, top first, and their buckets. Empty when the house
   * roles could not be read at all: with nothing to rank people by that row
   * disappears and the page is the by-type tabs it has always been.
   */
  authorityBuckets: readonly CommunityRole[];
  membersByAuthority: MembersByRole;
  /*
   * Every house role that is public, in ladder order. Empty when Notion is
   * unreachable, which resolves every member's badges to none.
   */
  houseRoles: readonly HouseRole[];
}) {
  /*
   * Whether there is anybody to group at all. With nobody (no NOTION_TOKEN, or
   * a CRM with roles but no members yet) the type row drops its "All": the
   * everyone view over an empty house is a blank page, where landing on the
   * first role's placeholder grid is what the page has always done.
   */
  const anyMembers = roles.some(
    (role) => (membersByRole[role.id] ?? []).length > 0
  );

  /*
   * An empty category is not shown at all — no tab, no placeholder grid. The
   * page only ever claims the community it actually has. The one exception is
   * the no-members fallback below, where the full static tab list is the page.
   */
  const visibleRoles = anyMembers
    ? roles.filter((role) => (membersByRole[role.id] ?? []).length > 0)
    : roles;
  const visibleBuckets = authorityBuckets.filter(
    (bucket) => (membersByAuthority[bucket.id] ?? []).length > 0
  );

  /* null on both = the everyone view; either one set narrows the grid. */
  const [authorityId, setAuthorityId] = useState<string | null>(null);
  const [typeId, setTypeId] = useState<string | null>(
    anyMembers ? null : (roles[0]?.id ?? null)
  );
  const [openMember, setOpenMember] = useState<Member | null>(null);

  /*
   * Resolving through the lists rather than trusting the ids keeps the page
   * rendered if a role disappears from the CRM between the cached render and a
   * later one — the dimension simply falls back to "All".
   */
  const authority =
    visibleBuckets.find((bucket) => bucket.id === authorityId) ?? null;
  const type = visibleRoles.find((role) => role.id === typeId) ?? null;

  const inAuthority = authority
    ? (membersByAuthority[authority.id] ?? [])
    : null;
  const inType = type ? (membersByRole[type.id] ?? []) : null;

  /*
   * The two rows are filters over one list, so the grid is their intersection —
   * a resident who is also a founder, and nobody else. Filtering the authority
   * side keeps the ranking order the buckets were built in; both sides are
   * already sorted, so there is nothing to re-sort.
   *
   * null means neither row narrowed anything: the everyone view.
   */
  let selected: Member[] | null;
  if (inAuthority && inType) {
    const ids = new Set(inType.map((member) => member.id));
    selected = inAuthority.filter((member) => ids.has(member.id));
  } else {
    selected = inAuthority ?? inType;
  }

  const everyone = selected === null;
  /*
   * An empty *single* filter is a corner of the CRM nobody has filled in yet,
   * so it keeps the placeholder grid that has always stood in for "coming
   * soon". An empty *intersection* is a different claim — there is simply no
   * resident founder — and six ghost cards would read as a promise of six.
   */
  const narrow = Boolean(authority && type);
  const empty = selected !== null && selected.length === 0;
  const showPlaceholders = empty && !narrow;
  /* Whichever single filter is empty owns the placeholders' label and count. */
  const placeholderFor = type ?? authority;

  const heading = [authority?.name, type?.name].filter(Boolean).join(" · ");
  /* The role's own blurb wins: it is the more specific of the two. */
  const description = type?.description ?? authority?.description ?? null;

  /*
   * The member's community roles as card tags, resolved through the fetched
   * role list in CRM order — a vanished role simply drops off the card. The
   * Card label is the wearable form ("Hacker"), the tab name stays the tab's.
   */
  const typeChips = (member: Member) =>
    roles
      .filter((role) => member.roleIds.includes(role.id))
      .map((role) => role.cardLabel || role.name);

  const cards = (members: readonly Member[]) =>
    members.map((member) => (
      <MemberCard
        key={member.id}
        member={member}
        badges={houseRoleBadges(member, houseRoles)}
        chips={typeChips(member)}
        onOpen={() => setOpenMember(member)}
      />
    ));

  return (
    <div>
      <div className="space-y-3 border-b border-border pb-4">
        {/* No rungs with anyone on them means no row to filter with. */}
        {visibleBuckets.length > 0 && (
          <FilterRow
            label="Filter by rank in the house"
            tabs={visibleBuckets}
            selectedId={authorityId}
            onSelect={setAuthorityId}
            tone="primary"
          />
        )}
        <FilterRow
          label="Filter by what they do"
          tabs={visibleRoles}
          selectedId={typeId}
          onSelect={setTypeId}
          tone="secondary"
          showAll={anyMembers}
        />
      </div>

      <div role="tabpanel" className="mt-10">
        {/*
         * The everyone view carries a role name over every section already, so
         * a heading above it would only repeat the first one.
         */}
        {!everyone && (
          <>
            <p className="text-sm tracking-[0.2em] text-concrete uppercase">
              {heading}
              {showPlaceholders && (
                <span className="text-steel"> — placeholders</span>
              )}
            </p>
            {description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-steel">
                {description}
              </p>
            )}
          </>
        )}

        {everyone ? (
          <div className="space-y-12">
            {visibleRoles.map((role) => {
              const inRole = membersByRole[role.id] ?? [];
              /* An empty role is a tab of placeholders, not a blank heading. */
              if (inRole.length === 0) return null;
              return (
                <section key={role.id}>
                  <h2 className="text-sm tracking-[0.2em] text-concrete uppercase">
                    {role.name}
                  </h2>
                  {role.description && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-steel">
                      {role.description}
                    </p>
                  )}
                  <div className={`mt-6 ${GRID}`}>{cards(inRole)}</div>
                </section>
              );
            })}
          </div>
        ) : showPlaceholders ? (
          <div className={`mt-8 ${GRID}`}>
            {Array.from({ length: placeholderFor?.placeholders ?? 6 }, (_, i) => (
              <PlaceholderCard
                key={`${placeholderFor?.id}-placeholder-${i}`}
                role={placeholderFor?.cardLabel ?? ""}
              />
            ))}
          </div>
        ) : empty ? (
          /* An intersection nobody is standing in — said plainly, once. */
          <p className="mt-8 text-xs tracking-[0.25em] text-steel uppercase">
            Nobody here yet
          </p>
        ) : (
          <div className={`mt-8 ${GRID}`}>{cards(selected ?? [])}</div>
        )}
      </div>

      {openMember && (
        <MemberProfile
          member={openMember}
          badges={houseRoleBadges(openMember, houseRoles)}
          onClose={() => setOpenMember(null)}
        />
      )}
    </div>
  );
}
