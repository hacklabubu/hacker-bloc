import type { LadderStep } from "@/lib/community";

/*
 * The house pecking order, straight from the "roles in the house" CRM (see
 * authorityLadder in lib/community.ts). Server component: it is a list of
 * strings with nothing to click, so it stays out of the browser bundle.
 *
 * Top rung first — the house reads its hierarchy downwards, so the highest
 * level is the first thing on the page.
 *
 * One rung per row rather than an across-the-page strip: a rung carries a
 * sentence of responsibilities plus the names standing on it, and narrow
 * columns would turn those into a wall of two-word lines. The row splits into a
 * spec-sheet grid on desktop — level, rung, what it means — and stacks on
 * mobile.
 */
export function AuthorityLadder({ steps }: { steps: readonly LadderStep[] }) {
  if (steps.length === 0) return null;

  return (
    <ol
      aria-label="House levels"
      className="w-full border border-border bg-asphalt"
    >
      {steps.map((step) => (
        <li
          key={step.level}
          className="flex flex-col gap-1.5 border-b border-border px-5 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6 sm:px-6 sm:py-5"
        >
          <span className="shrink-0 text-xs font-bold tracking-[0.25em] text-signal uppercase sm:w-16">
            LVL {step.level}
          </span>
          {/*
           * Roles sharing a rung are one step, joined rather than repeated —
           * two names on one level mean the same amount of say.
           */}
          <span className="shrink-0 text-sm font-bold tracking-[0.2em] text-beige uppercase sm:w-56">
            {step.names.join(" / ")}
          </span>
          {/*
           * What the rung means, and who is on it — either of which the CRM may
           * leave blank. Concrete rather than the steel used for card blurbs:
           * dim enough to stay under the rung name, but this is the copy that
           * says what the rung costs, and steel on asphalt is near-invisible
           * this small.
           */}
          {(step.responsibilities || step.members.length > 0) && (
            <div className="min-w-0 space-y-1.5">
              {step.responsibilities && (
                <p className="text-xs leading-5 text-concrete">
                  {step.responsibilities}
                </p>
              )}
              {/*
               * Who is actually standing here. Beige and uppercase to read as
               * names rather than prose — an empty rung simply says nothing.
               */}
              {step.members.length > 0 && (
                <p className="text-[10px] leading-5 tracking-[0.2em] text-beige/70 uppercase">
                  {step.members.join(" · ")}
                </p>
              )}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
