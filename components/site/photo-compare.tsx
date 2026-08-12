"use client";

import { useId } from "react";
import { PhotoLayer } from "@/components/site/photo-slot";

/*
 * Drag-to-compare before/after slider. Both photos stack: "before" is the base
 * layer and "after" is clipped to the region right of the handle, so the halves
 * stay spatially truthful to the corner labels at every position — left of the
 * handle is always before, right is always after. A full-bleed transparent
 * range input drives the position (drag, click, touch, and keyboard for free).
 * Controlled from the parent because the position also drives the copy beside
 * it. Note the polarity: value=0 is all "after", value=100 is all "before".
 */
export function PhotoCompare({
  label,
  before,
  after,
  ratio = "4/3",
  className = "",
  value,
  onChange,
}: {
  label: string;
  before?: string;
  after?: string;
  ratio?: string;
  className?: string;
  value: number; // 0-100
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <figure
      className={`group relative overflow-hidden border border-border bg-asphalt select-none has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-signal ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <PhotoLayer src={before} alt={`${label} — before investment`} />
      </div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${value}%)` }}
      >
        <PhotoLayer src={after} alt={`${label} — after investment`} />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-signal"
        style={{ left: `${value}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-signal bg-charcoal text-xs text-signal">
          ↔
        </div>
      </div>

      <span className="pointer-events-none absolute top-2 left-3 text-[9px] tracking-[0.3em] text-beige uppercase">
        Before
      </span>
      <span className="pointer-events-none absolute top-2 right-3 text-[9px] tracking-[0.3em] text-signal uppercase">
        After
      </span>

      <label htmlFor={id} className="sr-only">
        Drag to compare {label} before and after investment
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 border-t border-border bg-charcoal/90 px-3 py-2">
        <span className="text-[10px] tracking-[0.2em] text-beige uppercase">
          {label}
        </span>
      </figcaption>
    </figure>
  );
}
