"use client";

import { useEffect, useState, type ReactNode } from "react";

const FLOORS = 7;
const WINDOWS = 12;

/* deterministic first paint (every 3rd window lit) so SSR and client agree */
const initialLit = () => {
  const lit = new Set<number>();
  for (let i = 0; i < FLOORS * WINDOWS; i += 3) lit.add(i);
  return lit;
};

const SIGNAL_FRAMES = [")", "))", ")))", "))) ·"];

export function AsciiBloc() {
  const [lit, setLit] = useState<Set<number>>(initialLit);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const windows = setInterval(() => {
      setLit((prev) => {
        const next = new Set(prev);
        for (let k = 0; k < 3; k++) {
          const i = Math.floor(Math.random() * FLOORS * WINDOWS);
          if (next.has(i)) next.delete(i);
          else next.add(i);
        }
        return next;
      });
    }, 350);
    const antenna = setInterval(
      () => setFrame((f) => (f + 1) % SIGNAL_FRAMES.length),
      450
    );
    return () => {
      clearInterval(windows);
      clearInterval(antenna);
    };
  }, []);

  const rows: ReactNode[] = [];

  const wall = "text-steel";
  const dim = "text-steel";
  const on = "text-signal";

  // antenna + broadcast signal
  rows.push(
    <div key="a1">
      <span className={wall}>{"            ╥"}</span>
      <span className={on}>{"  " + SIGNAL_FRAMES[frame]}</span>
    </div>,
    <div key="a2">
      <span className={wall}>{"         ┌──╨──┐"}</span>
    </div>
  );

  // roof — interior width matches floor rows: " " + 12 cells of 2 chars + " "
  const INNER = WINDOWS * 2 + 2;
  rows.push(
    <div key="roof">
      <span className={wall}>{"┌" + "─".repeat(INNER) + "┐"}</span>
    </div>
  );

  // floors
  for (let f = 0; f < FLOORS; f++) {
    const cells: ReactNode[] = [];
    cells.push(
      <span key="l" className={wall}>
        {"│ "}
      </span>
    );
    for (let w = 0; w < WINDOWS; w++) {
      const i = f * WINDOWS + w;
      const isLit = lit.has(i);
      cells.push(
        <span key={w} className={isLit ? on : dim}>
          {isLit ? "█ " : "▒ "}
        </span>
      );
    }
    cells.push(
      <span key="r" className={wall}>
        {" │"}
      </span>
    );
    rows.push(<div key={`f${f}`}>{cells}</div>);
  }

  // ground floor — door takes one 2-char window cell, keeping alignment
  const door = Math.floor(WINDOWS / 2) - 1;
  const groundCells: ReactNode[] = [];
  groundCells.push(
    <span key="l" className={wall}>
      {"│ "}
    </span>
  );
  for (let w = 0; w < WINDOWS; w++) {
    if (w === door) {
      groundCells.push(
        <span key={w} className={on}>
          {"▟▙"}
        </span>
      );
    } else {
      groundCells.push(
        <span key={w} className={dim}>
          {"▒ "}
        </span>
      );
    }
  }
  groundCells.push(
    <span key="r" className={wall}>
      {" │"}
    </span>
  );
  rows.push(<div key="ground">{groundCells}</div>);

  // base + ground hatching
  rows.push(
    <div key="base">
      <span className={wall}>{"└" + "─".repeat(INNER) + "┘"}</span>
    </div>,
    <div key="dirt">
      <span className={dim}>{"░".repeat(INNER + 6)}</span>
    </div>
  );

  return (
    <figure className="hb-flicker select-none" aria-label="ASCII drawing of the Hacker Bloc building, windows flickering">
      {/* system mono, not next/font: subsetted webfonts drop the box-drawing
          glyphs and mixed fallback widths break column alignment */}
      <pre
        className="text-[9px] leading-[1.15] sm:text-xs sm:leading-[1.2] md:text-sm"
        style={{ fontFamily: "Menlo, Consolas, 'DejaVu Sans Mono', monospace" }}
      >
        {rows}
      </pre>
      <figcaption className="mt-3 text-[10px] tracking-[0.3em] text-concrete uppercase">
        blok_07 // rendering live occupancy
      </figcaption>
    </figure>
  );
}
