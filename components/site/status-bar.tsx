"use client";

import { useEffect, useState } from "react";

/* the bloc came online 2026-05-17, per brand system issue date */
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
    /* first tick via timeout so SSR markup and first client render agree */
    const t0 = setTimeout(() => setNow(Date.now()), 0);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, []);

  return (
    <span className="tabular-nums">
      {now === null ? "——D ——:——:——" : formatUptime(now)}
    </span>
  );
}
