"use client";

import { useActionState } from "react";
import { joinWaitlist, type JoinState } from "@/app/actions/join";

const initialState: JoinState = { status: "idle", message: "" };

const FIELD =
  "w-full border border-border bg-charcoal px-4 py-3 text-sm text-beige placeholder:text-steel focus:border-signal focus:outline-none";

export function JoinForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);

  if (state.status === "ok") {
    return (
      <div className="border border-signal bg-asphalt p-8">
        <p className="text-lg text-beige">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="join-name"
          className="mb-2 block text-xs tracking-[0.2em] text-concrete uppercase"
        >
          Name
        </label>
        <input
          id="join-name"
          name="name"
          required
          maxLength={200}
          autoComplete="name"
          placeholder="Your name"
          className={FIELD}
        />
      </div>
      <div>
        <label
          htmlFor="join-building"
          className="mb-2 block text-xs tracking-[0.2em] text-concrete uppercase"
        >
          What are you building?
        </label>
        <textarea
          id="join-building"
          name="building"
          required
          maxLength={2000}
          rows={5}
          placeholder="What it is, who it's for, what you've shipped."
          className={FIELD}
        />
      </div>
      <div>
        <label
          htmlFor="join-links"
          className="mb-2 block text-xs tracking-[0.2em] text-concrete uppercase"
        >
          Links
        </label>
        <input
          id="join-links"
          name="links"
          maxLength={1000}
          placeholder="GitHub, site, X — optional"
          className={FIELD}
        />
      </div>
      {state.status === "error" && (
        <p className="border border-rust/60 bg-rust/10 px-4 py-3 text-sm text-rust">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-14 w-full bg-signal px-8 text-base font-bold tracking-[0.2em] text-on-signal uppercase transition-colors hover:bg-signal/80 disabled:opacity-60 sm:w-auto sm:px-12 sm:text-lg"
      >
        {pending ? "Sending…" : "Apply"}
      </button>
    </form>
  );
}
