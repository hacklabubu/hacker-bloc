/*
 * Who may open /space/admin. Matched against the signed-in email,
 * case-insensitively. FOUNDER_EMAILS in the environment (comma-separated)
 * extends the list without a deploy.
 */
export const FOUNDER_EMAILS = ["mattbratos@gmail.com"] as const;

export function isFounder(email: string | null | undefined): boolean {
  if (!email) return false;
  const extra = (process.env.FOUNDER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const needle = email.toLowerCase();
  return [...FOUNDER_EMAILS, ...extra].some((e) => e.toLowerCase() === needle);
}
