import type { Metadata } from "next";
import Link from "next/link";
import { CommunityTabs } from "@/components/site/community-tabs";
import {
  AUTHORITY_BUCKETS,
  COMMUNITY_TABS,
  groupMembersByAuthority,
  groupMembersByRole,
} from "@/lib/community";
import {
  getCommunityRoles,
  getHouseRoleLevels,
  getHouseRoles,
  getMembers,
} from "@/lib/notion";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Hacker Bloc community — house team, founders, media, investors, factories, and partners.",
};

export default async function CommunityPage() {
  /*
   * Independent queries, so issue them together rather than serially. All four
   * are empty without NOTION_TOKEN: no roles falls back to the static tab list,
   * no members leaves every tab on its placeholder grid, no house roles simply
   * means no badges, and no levels means no way to rank anyone.
   *
   * The two house-role reads are deliberately separate rather than one call
   * filtered twice: `houseRoles` is the public list every badge and heading is
   * drawn from, `houseRoleLevels` is id-and-number only and includes the roles
   * the CRM keeps private, which the authority buckets need to bucket by (see
   * getHouseRoleLevels).
   */
  const [notionRoles, members, houseRoles, houseRoleLevels] = await Promise.all([
    getCommunityRoles(),
    getMembers(),
    getHouseRoles(),
    getHouseRoleLevels(),
  ]);
  const roles = notionRoles.length > 0 ? notionRoles : COMMUNITY_TABS;
  const membersByRole = groupMembersByRole(members, roles, houseRoles);

  /*
   * With no levels at all there is nothing to rank by, so the authority row is
   * not offered and the page is the by-type tabs alone. Three rungs that can
   * only ever answer "nobody here yet" would be a worse lie than no row.
   */
  const rankable = houseRoleLevels.some((role) => role.level !== null);
  const authorityBuckets = rankable ? AUTHORITY_BUCKETS : [];
  const membersByAuthority = groupMembersByAuthority(members, houseRoleLevels);

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          Community
        </h1>
        {/*
         * The ranking itself lives on /rules, next to the house rules it
         * explains — this page shows the people, in that order.
         */}
        <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          Everyone around the bloc, ranked by how much say they have in the
          house.{" "}
          <Link
            href="/rules"
            className="text-signal underline underline-offset-4 hover:text-beige"
          >
            How the house works →
          </Link>
        </p>
        <div className="mt-12">
          <CommunityTabs
            roles={roles}
            membersByRole={membersByRole}
            authorityBuckets={authorityBuckets}
            membersByAuthority={membersByAuthority}
            houseRoles={houseRoles}
          />
        </div>
      </section>
    </main>
  );
}
