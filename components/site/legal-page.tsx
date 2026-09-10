import Link from "next/link";
import { SectionHeading } from "@/components/site/section-heading";
import {
  CANCEL_MAILTO,
  WITHDRAW_MAILTO,
  type LegalDoc,
  type LegalSection,
} from "@/lib/legal";
import { OPERATOR } from "@/lib/site";

const LINK = "text-signal underline underline-offset-4 hover:text-beige";

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
            <a key={i} href={action} className={LINK}>
              {label}
            </a>
          );
        }
        return (
          <Link key={i} href={href} className={LINK}>
            {label}
          </Link>
        );
      })}
    </p>
  );
}

function Section({ section }: { section: LegalSection }) {
  return (
    <section className="mt-16 sm:mt-20">
      <SectionHeading>{section.heading}</SectionHeading>
      <div className="max-w-3xl space-y-6 text-base leading-8 text-concrete sm:text-lg sm:leading-9">
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
function WithdrawalButton() {
  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <a
        href={WITHDRAW_MAILTO}
        className="inline-flex h-12 items-center border border-beige/50 bg-beige/5 px-6 text-xs tracking-[0.2em] text-beige uppercase transition-colors hover:border-beige hover:bg-beige/10"
      >
        Withdraw from contract here
      </a>
      <a
        href={CANCEL_MAILTO}
        className="inline-flex h-12 items-center border border-border px-6 text-xs tracking-[0.2em] text-concrete uppercase transition-colors hover:text-signal"
      >
        Cancel membership
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
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <h1 className="font-heading text-4xl leading-tight uppercase text-beige sm:text-5xl md:text-6xl">
          {doc.title}
        </h1>
        <p className="mt-4 text-sm tracking-widest text-steel uppercase">
          Last updated {longDate(doc.updated)}
        </p>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-concrete sm:text-xl sm:leading-9">
          {doc.intro}
        </p>
        {withdrawal && <WithdrawalButton />}

        {doc.sections.map((section) => (
          <Section key={section.heading} section={section} />
        ))}

        <p className="mt-16 max-w-3xl text-sm text-steel">
          Questions go to{" "}
          <a href={`mailto:${OPERATOR.email}`} className="underline underline-offset-4 hover:text-signal">
            {OPERATOR.email}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
