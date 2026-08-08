"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "HB_BIOS v1.1.0 — HACKER BLOC CORE COLLECTIVE",
  "> mount /dev/warsaw ................. OK",
  "> load brand.sys .................... OK",
  "> checking bunks .................... 22 FOUND",
  "> waking residents .................. 07 NODES ONLINE",
  "> signal strength ................... ▮▮▮▮▮ STRONG",
  "> LIVE OFFLINE. STAY ONLINE.",
  "root@hacker-bloc:~# ./welcome",
];

export function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("hb-booted")) return;
    sessionStorage.setItem("hb-booted", "1");
    /* deferred so SSR markup and first client render agree */
    const show = setTimeout(() => setVisible(true), 0);

    const interval = setInterval(() => {
      setLineCount((n) => {
        if (n >= BOOT_LINES.length) {
          clearInterval(interval);
          setFading(true);
          setTimeout(() => setVisible(false), 500);
          return n;
        }
        return n + 1;
      });
    }, 180);

    return () => {
      clearTimeout(show);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-100 bg-charcoal p-6 sm:p-12 transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      onClick={() => setVisible(false)}
      aria-hidden
    >
      <pre className="text-signal text-xs sm:text-sm leading-6">
        {BOOT_LINES.slice(0, lineCount).join("\n")}
        <span className="hb-blink">█</span>
      </pre>
    </div>
  );
}
