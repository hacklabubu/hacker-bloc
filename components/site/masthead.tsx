import { TerminalWordmark } from "@/components/site/terminal-art";
import { getWordmarks } from "@/lib/wordmarks";

/* The pixel wordmark above the dashed frame, on every page. */
export function Masthead() {
  return (
    <div className="terminal-masthead">
      <TerminalWordmark wordmarks={getWordmarks()} />
    </div>
  );
}
