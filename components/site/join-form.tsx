"use client";

import { useActionState } from "react";
import { joinWaitlist, type JoinState } from "@/app/actions/join";
import { JOIN_TYPES } from "@/lib/community";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: JoinState = { status: "idle", message: "" };

const FIELD =
  "w-full border border-border bg-charcoal px-4 py-3 text-sm text-beige placeholder:text-steel focus:border-signal focus:outline-none";

const LABEL = "mb-2 block text-xs tracking-[0.2em] text-concrete uppercase";

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
        <label htmlFor="join-type" className={LABEL}>
          I am a
        </label>
        <Select name="type" required>
          <SelectTrigger
            id="join-type"
            className="w-full rounded-none border-border bg-charcoal px-4 py-3 text-xs data-[size=default]:h-auto tracking-[0.2em] text-beige uppercase transition-colors select-none focus-visible:border-signal focus-visible:ring-0 data-placeholder:text-steel dark:bg-charcoal dark:hover:bg-charcoal [&_svg]:text-concrete"
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="rounded-none border border-border bg-asphalt p-0 shadow-none ring-0"
          >
            {JOIN_TYPES.map((t, i) => (
              <SelectItem
                key={t.value}
                value={t.value}
                className="rounded-none border-b border-border/40 px-4 py-3 text-xs tracking-[0.2em] text-concrete uppercase last:border-b-0 focus:bg-charcoal focus:text-signal data-checked:text-beige [&_svg]:text-signal"
              >
                <span aria-hidden className="mr-2 text-steel">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="join-name" className={LABEL}>
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
        <label htmlFor="join-hacklab" className={LABEL}>
          Hacklab profile
        </label>
        <input
          id="join-hacklab"
          name="hacklab"
          required
          maxLength={300}
          placeholder="hacklab.so/your-handle"
          className={FIELD}
        />
      </div>
      <div>
        <label htmlFor="join-help" className={LABEL}>
          How can you be useful to our community?
        </label>
        <textarea
          id="join-help"
          name="howCanIHelp"
          required
          maxLength={2000}
          rows={5}
          placeholder="Skills, projects, intros — what you actually bring to the bloc."
          className={FIELD}
        />
      </div>
      <div>
        <label htmlFor="join-heard" className={LABEL}>
          How did you hear about our community?
        </label>
        <input
          id="join-heard"
          name="heardAboutUs"
          required
          maxLength={1000}
          placeholder="A friend, an event, X, the flyer on the pole…"
          className={FIELD}
        />
      </div>
      <div>
        <label htmlFor="join-excites" className={LABEL}>
          What are you most excited about?
        </label>
        <textarea
          id="join-excites"
          name="excitesYouMost"
          required
          maxLength={2000}
          rows={3}
          placeholder="What would be the highest value we could give you?"
          className={FIELD}
        />
      </div>
      <label
        htmlFor="join-rules"
        className="flex cursor-pointer items-start gap-3 border border-border bg-asphalt p-4"
      >
        <Checkbox
          id="join-rules"
          name="rules"
          required
          className="mt-0.5 size-5 rounded-none border-border data-checked:border-signal data-checked:bg-signal data-checked:text-on-signal dark:data-checked:bg-signal"
        />
        <span className="text-sm leading-6 text-concrete">
          I confirm that I read the{" "}
          <a
            href="/rules"
            target="_blank"
            className="text-beige underline underline-offset-4 hover:text-signal"
          >
            hacker bloc rules
          </a>{" "}
          <span className="text-steel">(we want you to read them for real)</span>
        </span>
      </label>
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
