"use client";

import { useActionState } from "react";
import { joinWaitlist, type JoinState } from "@/app/come-over/actions";

const initialState: JoinState = { status: "idle", message: "" };

const FIELD_CLASSES =
  "w-full border border-border bg-charcoal px-3 py-2.5 text-sm text-beige placeholder:text-steel focus:border-signal focus:outline-none";

export function JoinForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);

  if (state.status === "ok") {
    return (
      <div className="border border-signal/60 bg-accent p-6 text-sm">
        <p className="text-steel">root@hacker-bloc:~#</p>
        <p className="mt-1 text-signal">
          ./join --accepted
          <span className="hb-blink">█</span>
        </p>
        <p className="mt-4 text-beige">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="join-name"
          className="mb-1.5 block text-[10px] tracking-[0.25em] text-concrete uppercase"
        >
          name / handle *
        </label>
        <input
          id="join-name"
          name="name"
          required
          maxLength={200}
          placeholder="pierogi_daemon"
          className={FIELD_CLASSES}
        />
      </div>
      <div>
        <label
          htmlFor="join-building"
          className="mb-1.5 block text-[10px] tracking-[0.25em] text-concrete uppercase"
        >
          what are you building? *
        </label>
        <textarea
          id="join-building"
          name="building"
          required
          maxLength={2000}
          rows={4}
          placeholder="no decks. what does it do, who is it for, what have you shipped?"
          className={FIELD_CLASSES}
        />
      </div>
      <div>
        <label
          htmlFor="join-links"
          className="mb-1.5 block text-[10px] tracking-[0.25em] text-concrete uppercase"
        >
          links — github / demo / x
        </label>
        <input
          id="join-links"
          name="links"
          maxLength={1000}
          placeholder="github.com/you · you.dev"
          className={FIELD_CLASSES}
        />
      </div>
      {state.status === "error" && (
        <p className="border border-rust/60 bg-rust/10 px-3 py-2 text-xs text-rust">
          err :: {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full border border-signal bg-signal px-6 py-3 text-xs font-bold tracking-[0.25em] text-on-signal uppercase transition-colors hover:bg-signal/80 disabled:opacity-60"
      >
        {pending ? "transmitting…" : "./join --waitlist"}
      </button>
      <p className="text-[10px] leading-4 text-steel">
        goes straight onto the residency &amp; community waitlist. no
        newsletters, no spam — we ping you when there&apos;s a bunk or a
        build weekend.
      </p>
    </form>
  );
}
