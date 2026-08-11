"use client";

import { useActionState } from "react";
import { joinWaitlist, type JoinState } from "@/app/actions/join";
import { JOIN_TYPES } from "@/lib/community";

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
          htmlFor="join-type"
          className="mb-2 block text-xs tracking-[0.2em] text-concrete uppercase"
        >
          I am a
        </label>
        <select
          id="join-type"
          name="type"
          required
          defaultValue=""
          className={`${FIELD} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238a8a8a' stroke-width='1.5'/%3E%3C/svg%3E")`,
          }}
        >
          <option value="" disabled>
            Select type
          </option>
          {JOIN_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
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
