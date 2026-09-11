import type { Wordmark } from "@/lib/wordmarks";

export function TerminalWordmark({ wordmarks }: { wordmarks: Wordmark[] }) {
  const wordmark = wordmarks[0];

  return (
    <div className="terminal-wordmark">
      <div className="terminal-wordmark-display" role="img" aria-label={`Hacker Bloc — ${wordmark.label} wordmark`}>
        <pre
          className="terminal-wordmark-art"
          data-color={wordmark.color}
          aria-hidden="true"
          style={{ fontSize: `min(18px, ${160 / wordmark.columns}cqw)` }}
        >
          {wordmark.art}
        </pre>
        <span className="terminal-wordmark-text" aria-hidden="true">
          Hacker
          <br />
          Bloc
        </span>
      </div>
    </div>
  );
}
