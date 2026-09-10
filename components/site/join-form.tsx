"use client";

import { useActionState } from "react";
import { joinWaitlist, type JoinState } from "@/app/actions/join";
import { JOIN_TYPES } from "@/lib/community";

const initialState: JoinState = { status: "idle", message: "" };

export function JoinForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);

  if (state.status === "ok") {
    return <p>{state.message}</p>;
  }

  return (
    <form action={formAction} className="terminal-form">
      <label className="terminal-field">
        <span>I am a</span>
        <select name="type" required defaultValue="">
          <option value="" disabled>
            Select type
          </option>
          {JOIN_TYPES.map((t, i) => (
            <option key={t.value} value={t.value}>
              {String(i + 1).padStart(2, "0")} {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="terminal-field">
        <span>Name</span>
        <input name="name" required maxLength={200} autoComplete="name" placeholder="Your name" />
      </label>
      <label className="terminal-field">
        <span>Hacklab profile</span>
        <input name="hacklab" required maxLength={300} placeholder="hacklab.so/your-handle" />
      </label>
      <label className="terminal-field">
        <span>How can you be useful to our community?</span>
        <textarea
          name="howCanIHelp"
          required
          maxLength={2000}
          rows={5}
          placeholder="Skills, projects, intros — what you actually bring to the bloc."
        />
      </label>
      <label className="terminal-field">
        <span>How did you hear about our community?</span>
        <input
          name="heardAboutUs"
          required
          maxLength={1000}
          placeholder="A friend, an event, X, the flyer on the pole…"
        />
      </label>
      <label className="terminal-field">
        <span>What are you most excited about?</span>
        <textarea
          name="excitesYouMost"
          required
          maxLength={2000}
          rows={3}
          placeholder="What would be the highest value we could give you?"
        />
      </label>
      <label className="terminal-check">
        <input type="checkbox" name="rules" required />
        <span>
          I confirm that I read the{" "}
          <a href="/rules" target="_blank" rel="noreferrer">
            hacker bloc rules
          </a>{" "}
          <span className="terminal-muted">(we want you to read them for real)</span>
        </span>
      </label>
      <div className="terminal-checkout">
        <button type="submit" className="terminal-button" disabled={pending}>
          {pending ? "Sending" : "Apply"} <span aria-hidden="true">↗</span>
        </button>
        <p className="terminal-muted" role="status">
          {state.status === "error" ? state.message : "We review every application."}
        </p>
      </div>
    </form>
  );
}
