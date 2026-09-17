export const MEMBERSHIP = {
  limit: 100,
  /* Members who have paid so far. Hand-edited until the Stripe mirror in Neon can answer it. */
  taken: 0,
  monthlyUsd: 100,
  signupUsd: 1_000,
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

/* Membership and patron contributions are both priced in US dollars (formatUsd below). */
/*
 * The same calendar day next month, clamped to that month's last day
 * (Jan 31 → Feb 28/29), as unix seconds: the first monthly charge of a new
 * membership (app/actions/membership.ts).
 */
export function nextMonthUnix(from: Date = new Date()): number {
  const target = new Date(from);
  const day = target.getUTCDate();
  target.setUTCDate(1);
  target.setUTCMonth(target.getUTCMonth() + 1);
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
  ).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return Math.floor(target.getTime() / 1000);
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/*
 * Space milestones. Each version unlocks when that many hackers have joined.
 * Order matters: it is the roadmap.
 */
export const ROADMAP = [
  {
    version: "1.0",
    hackers: 10,
    summary: "The hackerspace starts working.",
    items: [
      "Bathroom",
      "Kitchen",
      "Lockers",
      "Cool Lighting & Decoration",
      "Access for members 24/7",
    ],
  },
  {
    version: "2.0",
    hackers: 20,
    summary: "Tools on the benches.",
    // TODO: fourth item still undecided
    items: ["Monitors", "3D printers", "Soldering station", "???"],
  },
  {
    version: "3.0",
    hackers: 30,
    summary: "The space pays for itself.",
    items: [
      "Sauna in the garden",
      "Jacuzzi in the garden",
      "Graffiti on the walls",
      "House rent fully paid by the hackerspace",
    ],
  },
] as const;

/*
 * Patron contributions: whole dollars, one-time. The ceiling is Stripe's own
 * per-charge limit for USD ($999,999.99), so anything larger would be rejected.
 */
export const PATRON = {
  minUsd: 1,
  maxUsd: 999_999,
} as const;

export const RISK_NOTE =
  "Our landlord is looking for a buyer for this house. This project is one big experiment: we are trying to buy the house, but if we get kicked out we will have to move or close the space. Invest at your own risk. Refunds are not available.";
