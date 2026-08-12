import Image from "next/image";

/*
 * A single fill layer: the real photo when `src` is set, otherwise the
 * brutalist "no signal" stand-in. Shared by PhotoSlot and PhotoCompare so both
 * degrade identically when a shot hasn't landed yet. Expects a positioned
 * ancestor (the layers are absolutely placed).
 */
export function PhotoLayer({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 60vw, 100vw"
        className="object-cover"
      />
    );
  }
  return (
    <>
      {/*
       * Opaque backdrop first: the hatch and gradient below are both
       * translucent, so without this the placeholder would let a stacked layer
       * beneath it bleed through (PhotoCompare stacks two PhotoLayers).
       */}
      <div className="absolute inset-0 bg-asphalt" aria-hidden />
      <div className="hb-dashed absolute inset-0 opacity-20" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,255,154,0.06) 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <span className="absolute top-2 left-3 text-[9px] tracking-[0.3em] text-steel uppercase">
        no_signal // awaiting_photo
      </span>
      <span className="absolute top-2 right-3 text-signal/60">▚</span>
    </>
  );
}

/*
 * Renders a real photo when `src` is set. Without one it falls back to the
 * stand-in above plus the expected drop-in path so real shots can replace slots
 * 1:1 — see public/photos/MANIFEST.md for the full shot list.
 */
export function PhotoSlot({
  label,
  file,
  src,
  ratio = "4/3",
  className = "",
}: {
  label: string;
  file: string;
  src?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure
      className={`group relative overflow-hidden border border-border bg-asphalt ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <PhotoLayer src={src} alt={label} />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 border-t border-border bg-charcoal/90 px-3 py-2">
        <span className="text-[10px] tracking-[0.2em] text-beige uppercase">
          {label}
        </span>
        {!src && (
          <span className="hidden text-[9px] text-steel sm:inline">{file}</span>
        )}
      </figcaption>
    </figure>
  );
}
