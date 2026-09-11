import { MEMBERSHIP, formatUsd } from "@/lib/membership";

/*
 * Copy that appears on more than one page (and in the markdown twins), kept
 * in one place so the pages never drift apart.
 */
export const EXPERIMENT_NOTE =
  "This is an experiment. We are figuring out how the place should work as we go, and we want to build it with the community, so every piece of feedback, every idea and every suggestion is welcome. Tell us what you think.";

export const WHY_FEE = {
  heading: `Why ${formatUsd(MEMBERSHIP.signupUsd)} up front?`,
  body: "It is a filter, not a fundraiser. We want people who already build serious things and have serious experience, and who will treat a key to this house as a commitment rather than a trial. If that is you, the fee is a rounding error next to what you will get out of the room.",
} as const;

export const NO_EXCEPTIONS = {
  heading: "No exceptions.",
  body: "The only people who do not pay it are the house residents, because they live here. Everyone else pays the same fee, and that is the point.",
} as const;
