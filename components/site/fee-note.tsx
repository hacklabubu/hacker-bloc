import { NO_EXCEPTIONS, WHY_FEE } from "@/lib/copy";

/* "Why the fee" and the no-exceptions line, under the price on home and membership. */
export function FeeNote() {
  return (
    <div className="terminal-prose terminal-fee-note">
      <p>
        <strong>{WHY_FEE.heading}</strong> {WHY_FEE.body}
      </p>
      <p>
        <strong>{NO_EXCEPTIONS.heading}</strong> {NO_EXCEPTIONS.body}
      </p>
    </div>
  );
}
