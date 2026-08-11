import { Reveal } from "@/components/site/reveal";

const MANIFESTO = [
  "Warsaw has the talent. It never had the room. HACKER BLOC is the room — a brutalist block with Eastern Bloc roots and Silicon Valley ambition, wired for the people who build instead of pitching.",
  "We are not coworking. We are not an incubator. We are not a theoretical nonprofit. We put our own money, weekends, and power tools into this building, and it shows.",
  "The first wave is the founding crew: the ones who showed up when the dungeons were still dark, ran cable through concrete, hosted the first BBQs, and shipped the first hackathon before the paint dried.",
  "Everything here is skin in the game. Sponsors power it, residents run it, and nobody rents a desk — you earn a spot by building things that work.",
] as const;

export function FirstWave() {
  return (
    <div className="max-w-4xl space-y-8">
      {MANIFESTO.map((p, i) => (
        <Reveal key={i} delay={i * 80}>
          <p className="text-base leading-8 text-concrete sm:text-lg sm:leading-9 md:text-xl md:leading-10">
            <span className="text-signal">{">"}</span> {p}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
