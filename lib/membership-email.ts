/* Called only after a signed Stripe event confirms payment. Failed sends throw
 * so Stripe retries; the payment ledger has already been saved. */
export async function sendMembershipSetupEmail(sessionId: string, email: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MEMBERSHIP_EMAIL_FROM;
  const origin = process.env.SITE_URL;
  if (!key || !from || !origin) return;
  const setup = new URL("/auth/sign-up?next=%2Fspace", origin).href;
  const login = new URL("/auth/login?next=%2Fspace", origin).href;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `membership-setup/${sessionId}`,
    },
    body: JSON.stringify({
      from, to: [email], subject: "Your Hacker Bloc membership: finish setting up your account",
      text: `Thanks for joining Hacker Bloc. Your payment has been recorded.\n\nFinish setting up your account: ${setup}\n\nUse this email address and verify it to access your membership. You can finish later; you do not need to pay again.\n\nAlready have an account? Sign in: ${login}`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Membership setup email failed (${response.status})`);
}
