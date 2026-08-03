"use client";

import { useEffect, useState } from "react";

/* the block came online 2026-05-17, per brand system issue date */
const EPOCH = Date.UTC(2026, 4, 17, 12, 0, 0);

function formatUptime(now: number) {
  const s = Math.max(0, Math.floor((now - EPOCH) / 1000));
  const days = Math.floor(s / 86400);
  const h = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${days}D ${h}:${m}:${sec}`;
}

export function Uptime() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="tabular-nums">
      {now === null ? "——D ——:——:——" : formatUptime(now)}
    </span>
  );
}

export function StatusBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-charcoal/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-[10px] sm:text-xs tracking-widest uppercase">
        <a href="#top" className="flex items-center gap-2 text-beige">
          <span className="text-signal">▚</span>
          <span className="font-bold">HACKER BLOCK</span>
          <span className="hidden sm:inline text-concrete">// warsaw, pl</span>
        </a>
        <div className="flex items-center gap-4 text-concrete">
          <span className="hidden md:inline">
            uptime <Uptime />
          </span>
          <span className="hidden sm:inline">
            signal <span className="text-signal">▮▮▮▮▮</span>
          </span>
          <span className="flex items-center gap-1.5 border border-border px-2 py-0.5 text-beige">
            online <span className="hb-blink text-signal">●</span>
          </span>
        </div>
      </div>
    </header>
  );
}
