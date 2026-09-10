import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Wordmark = {
  id: string;
  label: string;
  art: string;
  columns: number;
  color: "monochrome" | "apple";
};

const ANSI_COLORS = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");

export function getWordmarks(): Wordmark[] {
  const source = readFileSync(join(process.cwd(), "content/ascii-art.txt"), "utf8")
    .replace(/\r\n?/g, "\n");
  const headings = [...source.matchAll(/^=== (.+) ===[\t ]*$/gm)];
  const ids = new Set<string>();

  if (!headings.length) {
    throw new Error("Add at least one === Design name === section to content/ascii-art.txt.");
  }

  const wordmarks = headings.flatMap((heading, index): Wordmark[] => {
    const label = heading[1].trim();
    const id = label.toLowerCase().replace(/\s+/g, "-");
    const section = source
      .slice(heading.index! + heading[0].length, headings[index + 1]?.index)
      .replace(/^\n+|\n+$/g, "")
      .replace(ANSI_COLORS, "");
    const lines = section.split("\n");
    const color = lines[0].trim() === "@color: apple" ? "apple" : "monochrome";
    const art = color === "apple" ? lines.slice(1).join("\n") : section;

    // An unfinished entry should not break the page while collecting new designs.
    if (!art.trim()) return [];
    if (!label || ids.has(id)) {
      throw new Error(`Each design in content/ascii-art.txt needs a unique name. Check "${label}".`);
    }
    ids.add(id);

    return [{
      id,
      label,
      art,
      columns: Math.max(...art.split("\n").map((row) => [...row].length)),
      color,
    }];
  });

  if (!wordmarks.length) {
    throw new Error("Add artwork to at least one design in content/ascii-art.txt.");
  }
  return wordmarks;
}
