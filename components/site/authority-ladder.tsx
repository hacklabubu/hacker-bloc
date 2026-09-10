import type { LadderStep } from "@/lib/community";

/*
 * The house pecking order, straight from the "roles in the house" CRM (see
 * authorityLadder in lib/community.ts). Top rung first. Server component: a
 * list of strings with nothing to click.
 */
export function AuthorityLadder({ steps }: { steps: readonly LadderStep[] }) {
  if (steps.length === 0) return null;

  return (
    <ol aria-label="House levels" className="terminal-ladder">
      {steps.map((step) => (
        <li key={step.level}>
          <span className="terminal-muted">LVL {step.level}</span>
          <strong>{step.names.join(" / ")}</strong>
          <div>
            {step.responsibilities ? <p>{step.responsibilities}</p> : null}
            {step.members.length > 0 ? (
              <p className="terminal-muted">{step.members.join(" · ")}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
