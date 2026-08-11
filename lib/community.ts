/** Shared community / join applicant types */

export const COMMUNITY_TABS = [
  { id: "hacker-bloc", label: "Hacker Bloc" },
  { id: "founders", label: "Founders" },
  { id: "media", label: "Media" },
  { id: "investors", label: "Investors" },
  { id: "factories", label: "Factories" },
  { id: "partners", label: "Partners" },
] as const;

export type CommunityTabId = (typeof COMMUNITY_TABS)[number]["id"];

/** Types people can select when applying (not core house team). */
export const JOIN_TYPES = [
  { value: "founder", label: "Founder" },
  { value: "media", label: "Media" },
  { value: "investor", label: "Investor" },
  { value: "factory", label: "Factory" },
  { value: "partner", label: "Partner" },
] as const;

export type JoinType = (typeof JOIN_TYPES)[number]["value"];

export const JOIN_TYPE_VALUES = JOIN_TYPES.map((t) => t.value) as readonly JoinType[];

export function isJoinType(v: string): v is JoinType {
  return (JOIN_TYPE_VALUES as readonly string[]).includes(v);
}
