/*
 * The vibe-coding instruction on /pati. Data lives here rather than in the
 * page so lib/markdown.ts can render the same steps for agents without the two
 * copies drifting.
 */

export const VIBE_STEPS = [
  {
    title: "Pick one tool and open it.",
    body: "Claude Code in a terminal, or Cursor if you want an editor around it. Do not compare tools for a week. Pick, open, go.",
  },
  {
    title: "Say what you want like you would to a friend.",
    body: "Outcome, not code. \"A page where I paste a recipe and it gives me a shopping list.\" Who it is for, what it does, what it should look like. Skip anything you do not have an opinion on.",
  },
  {
    title: "Start with something tiny.",
    body: "One screen, one feature. Ask for the smallest version that you could actually use today. Big asks produce big messes.",
  },
  {
    title: "Run it and look at it.",
    body: "Ask the tool how to run it if you do not know. Open it in the browser. Click around. The point is to see it, not to read it.",
  },
  {
    title: "Complain precisely.",
    body: "\"The button is too small and it does nothing when I click it.\" Paste error messages whole, do not paraphrase them. One problem per message beats five.",
  },
  {
    title: "Ask it to explain when you are curious.",
    body: "\"What does this file do?\" \"Why did you do it this way?\" You do not have to understand the code to use it, but every explanation you ask for makes the next prompt better.",
  },
  {
    title: "Save a checkpoint before every big change.",
    body: "Tell it to commit to git. When a change breaks things, tell it to go back to the last commit. Undo is what makes being fearless cheap.",
  },
  {
    title: "Ship it and send someone the link.",
    body: "Tell it to deploy to Vercel. A link a friend can open is worth more than a week of polishing. Then go back to step two with what they said.",
  },
] as const;

export const VIBE_TOOLS = [
  {
    name: "Claude Code",
    url: "https://claude.com/claude-code",
    note: "runs in the terminal, works on whole projects. What the house uses.",
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
    note: "an editor with the AI built in, if you want to see the code next to the chat.",
  },
  {
    name: "v0",
    url: "https://v0.app",
    note: "in the browser, good for a first screen you can show someone in ten minutes.",
  },
  {
    name: "Vercel",
    url: "https://vercel.com",
    note: "where the thing goes so it has a link.",
  },
] as const;
