import type { Metadata } from "next";
import { CommunityTabs } from "@/components/site/community-tabs";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Hacker Bloc community — house team, founders, media, investors, factories, and partners.",
};

export default function CommunityPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          Community
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          The people around the house — core team, founders, media, investors,
          factories, and partners.
        </p>
        <div className="mt-12">
          <CommunityTabs />
        </div>
      </section>
    </main>
  );
}
