"use client";

import { useState } from "react";

const VLOG_ID = "ZA1CCcHrcLI";

/*
 * Click-to-load facade instead of an eager embed: the YouTube player pulls
 * ~1MB of script before anyone presses play, which alone wrecked mobile page
 * weight. Until clicked this is one thumbnail — the same frame the embed
 * would show — and the real iframe (with autoplay) only exists after intent.
 */
export function Error529() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full overflow-hidden border border-border bg-charcoal aspect-video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VLOG_ID}?autoplay=1`}
          title="Error 529"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play Error 529"
          className="group absolute inset-0 h-full w-full"
        >
          {/* Same host trade-off as member photos: enumerable remote hosts
              make next/image brittle here, and this image is behind a click. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${VLOG_ID}/sddefault.jpg`}
            alt="Error 529 vlog thumbnail"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-20 items-center justify-center border border-beige/60 bg-charcoal/80 text-2xl text-signal transition-colors group-hover:border-signal">
              ▶
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
