export const MEMBERSHIP = {
  limit: 100,
  monthlyUsd: 100,
  signupUsd: 1_000,
  spaceGoalUsd: 10_000,
  rentPercent: 50,
  setupPercent: 50,
  benefits: [
    {
      title: "All events. You’re in.",
      description: "Access to every event in the Bloc.",
    },
    {
      title: "Your space. 24/7.",
      description: "Round-the-clock access to the hackerspace.",
    },
    {
      title: "Build more than projects.",
      description:
        "Help shape the space, from what we buy to what we build next.",
    },
  ],
} as const;

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Read on the server; checkout stays unavailable until a real URL is set. */
export function getMembershipPaymentUrl(): string | null {
  const value = process.env.FOUNDING_MEMBERSHIP_PAYMENT_URL?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
