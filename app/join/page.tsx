import type { Metadata } from "next";
import { JoinForm } from "@/components/site/join-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Apply to Hacker Bloc — the physical hacker house in Warsaw. Ambitious founders only.",
};

export default function JoinPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          Join
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          Apply to the house. Ambitious founders only — we review every
          application.
        </p>
        <p className="mt-4 text-base text-concrete sm:text-lg">
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-beige underline underline-offset-4 hover:text-signal"
          >
            {SITE.address}
          </a>
        </p>
        <div className="mt-12 max-w-xl">
          <JoinForm />
        </div>
      </section>
    </main>
  );
}
