import type { Metadata } from "next";
import { AuthorityLadder } from "@/components/site/authority-ladder";
import { SectionHeading } from "@/components/site/section-heading";
import { authorityLadder } from "@/lib/community";
import { getHouseRoles, getMembers, getRules } from "@/lib/notion";

export const metadata: Metadata = {
  title: "House rules",
  description:
    "The Hacker Bloc house rules. Read them before you show up — your tier decides what you get.",
};

export default async function RulesPage() {
  /*
   * Independent queries, so issue them together rather than serially. All three
   * are empty without NOTION_TOKEN: no rules leaves the "being written" note,
   * and no house roles or members simply drops the hierarchy section — the page
   * then reads exactly as it did before the ladder existed.
   */
  const [rules, houseRoles, members] = await Promise.all([
    getRules(),
    getHouseRoles(),
    getMembers(),
  ]);
  const ladder = authorityLadder(houseRoles, members);

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          House rules
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          Read them before you show up. We are not a hostel, not a coworking,
          not a party flat — we are laser focused on building Hacklab.
        </p>
        {/*
         * Who decides, before what is decided: the rules below read differently
         * once you know which rung you are standing on. Skipped entirely when
         * the CRM has no ranked roles to show.
         */}
        {ladder.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <SectionHeading>The hierarchy</SectionHeading>
            <AuthorityLadder steps={ladder} />
          </section>
        )}

        <section className="mt-16 sm:mt-20">
          <SectionHeading>The rules</SectionHeading>
          {rules.length > 0 ? (
            <ol className="max-w-3xl border-t border-border">
              {rules.map((rule, i) => (
                <li
                  key={rule}
                  className="flex gap-6 border-b border-border py-6"
                >
                  <span className="shrink-0 pt-1 text-sm font-bold tracking-[0.2em] text-signal tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg leading-8 text-beige sm:text-xl sm:leading-9">
                    {rule}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm tracking-[0.2em] text-steel uppercase">
              Rules are being written — ask hacker daddy.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
