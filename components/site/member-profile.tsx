"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Member } from "@/lib/community";

/*
 * The "how can I help?" panel behind a community card.
 *
 * Hand-rolled rather than a dialog library: the house style is one solid slab
 * with a 1px border and no radius or shadow, which is most of what a dialog
 * primitive brings. What it *does* bring — Escape, backdrop dismissal, focus
 * containment, scroll lock — is the short list implemented below.
 */

const HEADING = "text-xs font-bold tracking-[0.25em] uppercase";

const BODY = "mt-3 text-sm leading-6 whitespace-pre-line text-concrete";

const ACTION =
  "inline-flex items-center border border-border px-4 py-2.5 text-xs font-bold tracking-[0.2em] text-beige uppercase transition-colors hover:border-signal hover:text-signal";

const CHIP =
  "border border-steel px-2.5 py-1 text-[10px] tracking-[0.2em] text-signal uppercase";

/*
 * House-role badges — the rank line under the name. Same slab as CHIP,
 * deliberately beige rather than signal green: the two lists sit a few lines
 * apart in the header and mean different things — what the member *is* in the
 * house vs what they offer the community.
 */
const HOUSE_CHIP =
  "border border-beige/50 px-2.5 py-1 text-[10px] tracking-[0.2em] text-beige uppercase";

/* Elements that can hold focus inside the panel, for the Tab cycle below. */
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Section({
  title,
  children,
  tone = "default",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "default" | "warning";
}) {
  const warning = tone === "warning";
  return (
    <section
      className={`border-t px-6 py-6 sm:px-8 ${
        warning ? "border-t-rust/60 bg-rust/5" : "border-t-border"
      }`}
    >
      <h3 className={`${HEADING} ${warning ? "text-rust" : "text-signal"}`}>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function MemberProfile({
  member,
  badges,
  onClose,
}: {
  member: Member;
  /*
   * The member's rank in the house, already resolved — the panel's only role
   * line, matching the card that opened it. Empty for a member with no public
   * house role, who then shows none.
   */
  badges: string[];
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      /*
       * aria-modal tells assistive tech the rest of the page is inert, so keep
       * the actual Tab order inside the panel to match that promise.
       */
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* Scroll lock: the panel scrolls internally, the page behind it must not. */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    /*
     * Read before moving focus: at this point the card that opened the panel is
     * still the active element, and it should get focus back on close.
     */
    const opener = document.activeElement;
    panelRef.current?.focus();
    return () => {
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  const actions: { href: string; label: string; external: boolean }[] = [];
  if (member.email) {
    actions.push({
      href: `mailto:${member.email}`,
      label: "Write me",
      external: false,
    });
  }
  if (member.bookingLink) {
    actions.push({
      href: member.bookingLink,
      label: "Book a meeting",
      external: true,
    });
  }
  if (member.hacklabProfile) {
    actions.push({
      href: member.hacklabProfile,
      label: "Hacklab profile",
      external: true,
    });
  }
  if (member.link) {
    actions.push({ href: member.link, label: "Link", external: true });
  }

  return (
    <div
      /*
       * Backdrop. The click handler fires only for the backdrop itself, never
       * for clicks that bubble up out of the panel.
       */
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-charcoal/90 p-4 backdrop-blur-sm sm:items-center sm:p-8"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name} — how can I help`}
        tabIndex={-1}
        className="relative my-auto w-full max-w-2xl border border-border bg-asphalt outline-none sm:max-h-[88vh] sm:overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 z-10 border-b border-l border-border bg-asphalt px-4 py-3 text-xs font-bold tracking-[0.2em] text-concrete uppercase transition-colors hover:text-signal"
        >
          Close ✕
        </button>

        <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:gap-6 sm:px-8 sm:py-8">
          <div
            className="flex w-28 shrink-0 items-center justify-center overflow-hidden border border-border bg-charcoal sm:w-32"
            style={{ aspectRatio: "1/1" }}
          >
            {member.photoUrl ? (
              /* Plain <img> for the same reason as the card — see community-tabs. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photoUrl}
                alt={member.name}
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[10px] tracking-[0.25em] text-steel uppercase">
                {member.name.slice(0, 2)}
              </span>
            )}
          </div>

          {/* pr on ≥sm keeps the name clear of the close button; stacked below
              that, the photo sits under the button instead. */}
          <div className="min-w-0 sm:pr-20">
            <h2 className="font-heading text-2xl leading-tight text-beige uppercase sm:text-3xl">
              {member.name}
            </h2>
            {badges.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <li key={badge} className={HOUSE_CHIP}>
                    {badge}
                  </li>
                ))}
              </ul>
            )}
            {member.building && (
              <p className="mt-3 text-sm leading-6 text-steel">
                {member.building}
              </p>
            )}
            {member.communityRoles.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {member.communityRoles.map((communityRole) => (
                  <li key={communityRole} className={CHIP}>
                    {communityRole}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {member.howCanIHelp && (
          <Section title="How can I help?">
            <p className={BODY}>{member.howCanIHelp}</p>
          </Section>
        )}

        {/*
         * Rendered when there is either instructions text or a way to reach the
         * member — a bare "Write me" button is still an answer to the question.
         */}
        {(member.howToGetHelp || actions.length > 0) && (
          <Section title="How to get help?">
            {member.howToGetHelp && (
              <p className={BODY}>{member.howToGetHelp}</p>
            )}
            {actions.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {actions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className={ACTION}
                    {...(action.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            )}
          </Section>
        )}

        {member.howNotToGetHelp && (
          <Section title="How NOT to get help" tone="warning">
            <p className={BODY}>{member.howNotToGetHelp}</p>
          </Section>
        )}
      </div>
    </div>
  );
}
