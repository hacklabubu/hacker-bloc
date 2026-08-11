/**
 * Decorative ASCII/text fragments scattered behind the hero like industrial
 * debris — construction-site stencils, telemetry, coordinates. Purely visual:
 * aria-hidden and pointer-events-none so it never intercepts the orbit or text.
 * Desktop only; on small screens it would collide with the hero copy.
 */
const FRAGMENTS = [
  { text: "▓▒░░ SIGNAL//OK", pos: "left-[4%] top-[12%]", tone: "text-signal/30" },
  { text: "БЛОК_07 // СТРОЙКА", pos: "right-[5%] top-[18%]", tone: "text-concrete/40" },
  { text: "┌─[ live ]─┐", pos: "left-[8%] bottom-[22%]", tone: "text-signal/25" },
  { text: "01001000 01000010", pos: "right-[10%] bottom-[14%]", tone: "text-concrete/30" },
  { text: "STREFA BUDOWY // KEEP OUT", pos: "left-[16%] top-[6%]", tone: "text-concrete/40" },
  { text: "░░░░▒▒▓▓██▓▓▒▒░░░░", pos: "right-[18%] top-[8%]", tone: "text-signal/20" },
  { text: "52.1702N 21.0787E", pos: "left-[5%] top-[55%]", tone: "text-concrete/40" },
  { text: "[SYS] uplink: OK", pos: "right-[4%] top-[60%]", tone: "text-signal/30" },
  { text: "═══════════", pos: "left-[40%] bottom-[6%]", tone: "text-concrete/25" },
  { text: "NO DECKS ALLOWED", pos: "right-[30%] bottom-[8%]", tone: "text-rust/60" },
] as const;

export function AsciiDetritus() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="hidden md:block">
        {FRAGMENTS.map((f) => (
          <span
            key={f.text}
            className={`absolute ${f.pos} ${f.tone} font-mono text-[10px] tracking-[0.3em] uppercase whitespace-nowrap`}
          >
            {f.text}
          </span>
        ))}
      </div>
    </div>
  );
}
