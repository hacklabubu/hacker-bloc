import type { Metadata } from "next";
import { JoinForm } from "@/components/site/join-form";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Apply to Hacker Bloc — the physical hacker house in Warsaw. Ambitious founders only.",
};

export default function JoinPage() {
  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="join-heading">
        <p className="terminal-location">Join</p>
        <h1 id="join-heading">Apply to the house.</h1>
        <p className="terminal-muted">Ambitious founders only. We review every application.</p>
      </section>
      <section className="terminal-section" aria-labelledby="join-legend">
        <h2 id="join-legend" className="terminal-legend">Application</h2>
        <div className="terminal-section-content">
          <JoinForm />
        </div>
      </section>
    </main>
  );
}
