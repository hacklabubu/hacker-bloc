/*
 * Stylized stand-in for a real photo. Renders a brutalist hatched frame
 * with the expected drop-in path so real shots can replace slots 1:1 —
 * see public/photos/MANIFEST.md for the full shot list.
 */
export function PhotoSlot({
  label,
  file,
  ratio = "4/3",
  className = "",
}: {
  label: string;
  file: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure
      className={`group relative overflow-hidden border border-border bg-asphalt ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div className="hb-dashed absolute inset-0 opacity-20" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,255,154,0.06) 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 border-t border-border bg-charcoal/90 px-3 py-2">
        <span className="text-[10px] tracking-[0.2em] text-beige uppercase">
          {label}
        </span>
        <span className="hidden text-[9px] text-steel sm:inline">{file}</span>
      </figcaption>
      <span className="absolute top-2 left-3 text-[9px] tracking-[0.3em] text-steel uppercase">
        no_signal // awaiting_photo
      </span>
      <span className="absolute top-2 right-3 text-signal/60">▚</span>
    </figure>
  );
}
