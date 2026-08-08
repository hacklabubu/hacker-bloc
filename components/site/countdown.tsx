"use client";

import { useEffect, useState } from "react";

function parts(msLeft: number) {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  return {
    days: String(Math.floor(s / 86400)).padStart(2, "0"),
    hours: String(Math.floor((s % 86400) / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
    seconds: String(s % 60).padStart(2, "0"),
  };
}

const BLANK = { days: "——", hours: "——", minutes: "——", seconds: "——" };

export function Countdown({
  target,
  className = "",
  compact = false,
}: {
  target: string;
  className?: string;
  compact?: boolean;
}) {
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

  const targetMs = new Date(target).getTime();
  const p = now === null ? BLANK : parts(targetMs - now);
  const units = compact
    ? ([["d", p.days], ["h", p.hours], ["m", p.minutes]] as const)
    : ([
        ["days", p.days],
        ["hrs", p.hours],
        ["min", p.minutes],
        ["sec", p.seconds],
      ] as const);

  if (compact) {
    return (
      <span className={`font-(family-name:--font-tech) tabular-nums ${className}`}>
        {units.map(([u, v]) => `${v}${u}`).join(" ")}
      </span>
    );
  }

  return (
    <div className={`flex gap-px bg-border ${className}`}>
      {units.map(([unit, value]) => (
        <div key={unit} className="flex-1 bg-charcoal px-3 py-4 text-center sm:px-6">
          <div className="font-(family-name:--font-tech) text-3xl font-bold tabular-nums text-signal sm:text-5xl">
            {value}
          </div>
          <div className="mt-2 text-[10px] tracking-[0.3em] text-concrete uppercase">
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
}
