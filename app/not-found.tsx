import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404",
  description: "That door doesn't exist.",
};

const EXITS = [
  { href: "/", label: "The Bloc", note: "the manifesto, membership, and patrons" },
  { href: "/community", label: "Community", note: "everyone around the bloc" },
  { href: "/rules", label: "Rules", note: "who decides what, and why" },
  { href: "/join", label: "Join", note: "apply to the house" },
] as const;

export default function NotFound() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <p className="text-sm font-bold tracking-[0.3em] text-signal uppercase">
          404
        </p>
        <h1 className="mt-6 font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          No such door
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          You knocked on a wall. Nothing lives at this address — try one of the
          rooms that does.
        </p>

        <ul className="mt-12 max-w-2xl border-t border-border">
          {EXITS.map((exit) => (
            <li key={exit.href} className="border-b border-border">
              <Link
                href={exit.href}
                className="group flex items-baseline justify-between gap-6 py-6"
              >
                <span className="font-heading text-2xl uppercase text-beige transition-colors group-hover:text-signal sm:text-3xl">
                  {exit.label}
                </span>
                <span className="text-right text-xs tracking-[0.2em] text-steel uppercase transition-colors group-hover:text-concrete">
                  {exit.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
