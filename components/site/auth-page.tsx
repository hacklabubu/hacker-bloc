import type { ReactNode } from "react";

/* The frame every /auth page sits in: same terminal layout as the rest of the site. */
export function AuthPage({
  title,
  eyebrow = "Members",
  legend,
  children,
}: {
  title: string;
  eyebrow?: string;
  legend: string;
  children: ReactNode;
}) {
  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="auth-heading">
        <p className="terminal-location">{eyebrow}</p>
        <h1 id="auth-heading">{title}</h1>
      </section>
      <section className="terminal-section" aria-labelledby="auth-legend">
        <h2 id="auth-legend" className="terminal-legend">{legend}</h2>
        <div className="terminal-section-content">{children}</div>
      </section>
    </main>
  );
}
