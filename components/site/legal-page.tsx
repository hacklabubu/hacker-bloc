import Link from "next/link";
import {
  CANCEL_MAILTO,
  WITHDRAW_MAILTO,
  type LegalDoc,
  type LegalSection,
} from "@/lib/legal";
import { OPERATOR } from "@/lib/site";

/*
 * The two action words in the refund policy resolve to pre-filled mailto
 * links; everything else is a site path. Kept out of lib/legal.ts so the
 * markdown mirror can print the plain address instead.
 */
const ACTIONS: Record<string, string> = {
  cancel: CANCEL_MAILTO,
  withdraw: WITHDRAW_MAILTO,
};

/* Renders `[label](href)` as links and leaves the rest of the text alone. */
function Paragraph({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <p>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return part;
        const [, label, href] = match;
        const action = ACTIONS[href];
        if (action) {
          return (
            <a key={i} href={action}>
              {label}
            </a>
          );
        }
        return (
          <Link key={i} href={href}>
            {label}
          </Link>
        );
      })}
    </p>
  );
}

function Section({ section }: { section: LegalSection }) {
  return (
    <section className="terminal-section" aria-label={section.heading}>
      <h2 className="terminal-legend">{section.heading}</h2>
      <div className="terminal-section-content terminal-prose">
        {section.paragraphs.map((paragraph) => (
          <Paragraph key={paragraph} text={paragraph} />
        ))}
      </div>
    </section>
  );
}

function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/*
 * A withdrawal function on the trader's interface, as directive 2023/2673
 * requires for contracts concluded online: a clearly labelled button that
 * leads to a pre-filled withdrawal message. Only the refund policy shows it.
 */
function WithdrawalButtons() {
  return (
    <div className="terminal-actions">
      <a href={WITHDRAW_MAILTO} className="terminal-button">
        Withdraw from contract here <span aria-hidden="true">↗</span>
      </a>
      <a href={CANCEL_MAILTO} className="terminal-button">
        Cancel membership <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

export function LegalPage({
  doc,
  withdrawal = false,
}: {
  doc: LegalDoc;
  withdrawal?: boolean;
}) {
  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="legal-heading">
        <p className="terminal-location">{doc.title}</p>
        <h1 id="legal-heading">{doc.title}</h1>
        <p className="terminal-muted">Last updated {longDate(doc.updated)}</p>
        <p>{doc.intro}</p>
        {withdrawal ? <WithdrawalButtons /> : null}
      </section>

      {doc.sections.map((section) => (
        <Section key={section.heading} section={section} />
      ))}

      <section className="terminal-section" aria-label="Questions">
        <h2 className="terminal-legend">Questions</h2>
        <div className="terminal-section-content terminal-prose">
          <p>
            Questions go to <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
