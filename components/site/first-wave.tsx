import { Reveal } from "@/components/site/reveal";

const MANIFESTO = [
  "Warsaw has the talent. It never had the room. HACKER BLOC is the room — a brutalist block with Eastern Bloc roots and Silicon Valley ambition, wired for the people who build instead of pitching.",
  "We are not coworking. We are not an incubator. We are not a theoretical nonprofit. We put our own money, weekends, and power tools into this building, and it shows.",
  "The first wave is the founding crew: the ones who showed up when the dungeons were still dark, ran cable through concrete, hosted the first BBQs, and shipped the first hackathon before the paint dried.",
  "Everything here is skin in the game. Sponsors power it, residents run it, and nobody rents a desk — you earn a spot by building things that work.",
] as const;

const FIRST_WAVE_PERKS = [
  { glyph: "[⌂]", text: "first pick of the residency bunks" },
  { glyph: "[∞]", text: "free for founders, forever" },
  { glyph: "[♨]", text: "jacuzzi on the roof — yes, a jacuzzi. non-negotiable. it was in the manifesto before the wifi was." },
  { glyph: "[⚿]", text: "24/7 access to the dungeons" },
] as const;

export function FirstWave() {
  return (
    <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
      <div className="space-y-5 text-sm leading-7 text-concrete">
        {MANIFESTO.map((p, i) => (
          <Reveal key={i} delay={i * 80}>
            <p>
              <span className="text-signal">{">"}</span> {p}
            </p>
          </Reveal>
        ))}
      </div>
      <div className="border border-border bg-charcoal">
        <div className="border-b border-border px-4 py-2 text-[10px] tracking-[0.25em] text-concrete uppercase">
          first_wave // founding privileges
        </div>
        <ul className="divide-y divide-border">
          {FIRST_WAVE_PERKS.map((perk) => (
            <li
              key={perk.text}
              className={`flex gap-3 px-4 py-4 text-xs leading-5 ${
                perk.glyph === "[♨]"
                  ? "bg-accent text-beige"
                  : "text-concrete"
              }`}
            >
              <span className="text-signal">{perk.glyph}</span>
              <span className="uppercase tracking-wider">{perk.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
