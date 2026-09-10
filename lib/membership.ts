export const MEMBERSHIP = {
  limit: 100,
  /* Members who have paid so far. Hand-edited until the Stripe mirror in Neon can answer it. */
  taken: 0,
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

/*
 * Payment links are read on the server; a button stays disabled until its URL
 * is set. Only https URLs are accepted, so a typo can't turn into a bad link.
 */
function readPaymentUrl(name: string): string | null {
  const value = process.env[name]?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

/** Member checkout: the monthly subscription plus the one-time signup fee. */
export function getMembershipPaymentUrl(): string | null {
  return readPaymentUrl("FOUNDING_MEMBERSHIP_PAYMENT_URL");
}

/*
 * Space milestones. Each version is what the next chunk of money buys.
 * Order matters: it is the roadmap.
 */
export const ROADMAP = [
  {
    version: "1.0",
    goalUsd: MEMBERSHIP.spaceGoalUsd,
    summary: "The hackerspace starts working.",
    items: [
      "Bathroom",
      "Kitchen",
      "Wi-Fi 1 Gb/s",
      "Lockers",
      "Access for members 24/7",
    ],
  },
  {
    version: "2.0",
    goalUsd: 20_000,
    summary: "Tools on the benches.",
    // TODO: fourth item still undecided
    items: ["Monitors", "3D printers", "Soldering station", "???"],
  },
  {
    version: "3.0",
    goalUsd: 30_000,
    summary: "The space pays for itself.",
    items: [
      "Sauna in the garden",
      "Jacuzzi in the garden",
      "Graffiti on the walls",
      "House rent fully paid by the hackerspace",
    ],
  },
] as const;

/* Patron contributions: whole dollars, one-time, bounded so a typo can't become a $1M charge. */
export const PATRON = {
  minUsd: 5,
  maxUsd: 100_000,
} as const;

export const RISK_NOTE =
  "Our landlord is looking for a buyer for this house. This project is one big experiment: we are trying to buy the house, but if we get kicked out we will have to move or close the space. Invest at your own risk. We don't do refunds.";
