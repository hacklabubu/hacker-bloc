const PHRASES = [
  "LIVE OFFLINE. STAY ONLINE.",
  "BUILD TOGETHER. STAY WEIRD.",
  "ДОМ ДЛЯ ХАКЕРОВ. ДЛЯ СВОИХ.",
  "SIGNAL OVER STATUS.",
  "STAY CURIOUS. QUESTION EVERYTHING.",
  "СТРОИМ БУДУЩЕЕ. ЖИВЁМ СЕЙЧАС.",
  "OPEN SOURCE. OPEN DOORS. OPEN MINDS.",
];

export function Ticker() {
  const row = PHRASES.map((p, i) => (
    <span key={i} className="flex items-center">
      <span className="px-6">{p}</span>
      <span className="text-signal">✦</span>
    </span>
  ));

  return (
    <div
      className="overflow-hidden border-y border-border bg-asphalt py-2 text-xs tracking-[0.25em] text-concrete uppercase"
      aria-hidden
    >
      <div className="hb-marquee">
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0">{row}</div>
      </div>
    </div>
  );
}
