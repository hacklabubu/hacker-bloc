import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site/section-heading";
import { VIBE_STEPS, VIBE_TOOLS } from "@/lib/vibe";

export const metadata: Metadata = {
  title: "Pati",
  description:
    "A short instruction on how to vibe code: pick a tool, say what you want, start tiny, run it, complain, ship it.",
};

export default function PatiPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          Pati
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          How to vibe code. You describe what you want in plain words, an AI
          writes the code, you look at the result and complain until it is
          right. No syntax to learn first. The whole trick is talking clearly
          and starting small.
        </p>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>The steps</SectionHeading>
          <ol className="max-w-3xl border-t border-border">
            {VIBE_STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-6 border-b border-border py-6"
              >
                <span className="shrink-0 pt-1 text-sm font-bold tracking-[0.2em] text-signal tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-lg leading-8 text-beige sm:text-xl sm:leading-9">
                    {step.title}
                  </p>
                  <p className="mt-2 text-base leading-7 text-concrete sm:text-lg sm:leading-8">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 sm:mt-20">
          <SectionHeading>Tools</SectionHeading>
          <ul className="max-w-3xl space-y-4 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
            {VIBE_TOOLS.map((tool) => (
              <li key={tool.name}>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-signal underline underline-offset-4 hover:text-beige"
                >
                  {tool.name}
                </a>{" "}
                — {tool.note}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-16 text-sm text-concrete">
          Stuck? Someone in the house has been stuck on the same thing.{" "}
          <Link
            href="/contact"
            className="text-beige underline underline-offset-4 hover:text-signal"
          >
            Ask
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
