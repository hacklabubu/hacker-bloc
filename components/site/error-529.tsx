import { SOCIALS } from "@/lib/site";

export function Error529() {
  const yt = SOCIALS.find((s) => s.label.startsWith("YT"))!;
  return (
    <div>
      <a
        href={yt.url}
        target="_blank"
        rel="noreferrer"
        className="group block border border-border bg-charcoal"
      >
        <div
          className="relative flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 py-16 sm:min-h-[48vh]"
          style={{ aspectRatio: "16/9" }}
        >
          <span className="font-heading text-4xl uppercase text-beige sm:text-6xl">
            Error 529
          </span>
          <span className="mt-2 border border-signal px-6 py-3 text-xs font-bold tracking-[0.2em] text-signal uppercase transition-colors group-hover:bg-signal group-hover:text-on-signal sm:text-sm">
            Watch
          </span>
        </div>
      </a>
      <p className="mt-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
        The show about building the bloc — every failure, every ship.{" "}
        <a
          href={yt.url}
          target="_blank"
          rel="noreferrer"
          className="text-beige underline underline-offset-4 hover:text-signal"
        >
          YouTube
        </a>
      </p>
    </div>
  );
}
