import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PARTNERS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partners",
  description: "Who powers Hacker Bloc — Hacklab and Epikor.",
};

export default function PartnersPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          Partners
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          Who powers the house.
        </p>

        <ul className="mt-16 flex flex-col border-y border-border sm:flex-row">
          {PARTNERS.wall.map((partner, i) => (
            <li
              key={partner.name}
              className={`flex-1 ${i > 0 ? "border-t border-border sm:border-t-0 sm:border-l" : ""}`}
            >
              <a
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-36 items-center justify-center sm:h-40"
              >
                {partner.wide ? (
                  <span className="relative block h-20 w-52 overflow-hidden sm:h-24 sm:w-64">
                    <Image
                      src={partner.src}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      priority
                      className="absolute top-1/2 left-1/2 h-[340%] w-[340%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain mix-blend-screen transition-opacity group-hover:opacity-80"
                    />
                  </span>
                ) : (
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={partner.width}
                    height={partner.height}
                    unoptimized
                    priority
                    className="h-14 w-auto max-w-[18rem] object-contain transition-opacity group-hover:opacity-80 sm:h-16"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-16 text-sm text-concrete">
          <Link
            href="/sponsor"
            className="text-beige underline underline-offset-4 hover:text-signal"
          >
            Become a sponsor
          </Link>
        </p>
      </section>
    </main>
  );
}
