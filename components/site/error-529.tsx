import { SOCIALS } from "@/lib/site";

/*
 * ERROR 529 — the show. Placeholder panel until a real episode embed URL
 * exists; swap the inner block for a YouTube iframe once the channel is live.
 */
export function Error529() {
  const yt = SOCIALS.find((s) => s.label.startsWith("YT"))!;
  return (
    <div className="border border-border bg-charcoal">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[10px] tracking-[0.25em] uppercase">
        <span className="text-concrete">error_529 // the unfiltered journey</span>
        <span className="text-rust">● rec</span>
      </div>
      <a
        href={yt.url}
        target="_blank"
        rel="noreferrer"
        className="group block"
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <div className="hb-dashed absolute inset-0 opacity-15" aria-hidden />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="font-(family-name:--font-tech) text-4xl font-bold text-rust sm:text-6xl">
              ERROR 529
            </span>
            <span className="text-[10px] tracking-[0.3em] text-concrete uppercase">
              site overloaded — too many builders
            </span>
            <span className="mt-2 border border-signal px-6 py-2 text-xs tracking-[0.25em] text-signal uppercase transition-colors group-hover:bg-signal group-hover:text-on-signal">
              ▶ watch the latest episode
            </span>
          </div>
        </div>
      </a>
      <p className="border-t border-border px-4 py-3 text-xs text-concrete">
        The show about building the bloc — every failure, every fire, every
        ship.{" "}
        <a
          href={yt.url}
          target="_blank"
          rel="noreferrer"
          className="text-beige underline decoration-signal/50 underline-offset-4 hover:text-signal"
        >
          watch the unfiltered journey →
        </a>
      </p>
    </div>
  );
}
