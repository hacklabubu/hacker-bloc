import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The people behind Hacker Bloc — the team that runs the house in Warsaw.",
};

export default function CommunityPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          Team
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          The people who run the house.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex flex-col border border-dashed border-border bg-asphalt"
            >
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
                  Role
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
