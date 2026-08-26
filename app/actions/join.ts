"use server";

import { isJoinType } from "@/lib/community";
import { getSql } from "@/lib/db";
import { createApplication } from "@/lib/notion";

export type JoinState = {
  status: "idle" | "ok" | "error";
  message: string;
};

/*
 * Deliberately loose — anything with a dot-separated host counts. Applicants
 * paste "hacklab.so/whoever" as often as a full URL, so the missing scheme is
 * added rather than rejected.
 */
function normalizeUrl(raw: string): string | null {
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (!url.hostname.includes(".")) return null;
    return url.href;
  } catch {
    return null;
  }
}

/*
 * Best-effort mirror of the application into the Neon `waitlist` table. Notion
 * is the system of record; this stays as a backup so a Notion outage (or a
 * missing NOTION_TOKEN) doesn't lose a submission. Never throws.
 *
 * The table predates the current form (name, building, links, applicant_type),
 * so the new fields are packed into the closest legacy columns rather than
 * migrating a table that exists only for disaster recovery.
 */
async function backupToNeon(
  name: string,
  type: string,
  hacklabProfile: string,
  howCanIHelp: string,
  heardAboutUs: string,
  excitesYouMost: string
): Promise<boolean> {
  const building = `${howCanIHelp}\n\n[heard about us] ${heardAboutUs}\n\n[excited about] ${excitesYouMost}`;
  const links = hacklabProfile;
  try {
    const sql = getSql();
    try {
      await sql`
        INSERT INTO waitlist (name, building, links, applicant_type)
        VALUES (${name}, ${building}, ${links}, ${type})
      `;
      return true;
    } catch {
      /* Schema may not have applicant_type — prefix it into building. */
    }
    await sql`
      INSERT INTO waitlist (name, building, links)
      VALUES (${name}, ${`[${type}] ${building}`}, ${links})
    `;
    return true;
  } catch {
    return false;
  }
}

export async function joinWaitlist(
  _prev: JoinState,
  formData: FormData
): Promise<JoinState> {
  const name = String(formData.get("name") ?? "").trim();
  const hacklabRaw = String(formData.get("hacklab") ?? "").trim();
  const howCanIHelp = String(formData.get("howCanIHelp") ?? "").trim();
  const heardAboutUs = String(formData.get("heardAboutUs") ?? "").trim();
  const excitesYouMost = String(formData.get("excitesYouMost") ?? "").trim();
  const typeRaw = String(formData.get("type") ?? "").trim();
  const rulesRead = formData.get("rules") === "on";

  if (!isJoinType(typeRaw)) {
    return { status: "error", message: "Please select what type you are." };
  }
  if (!name) {
    return { status: "error", message: "Name is required." };
  }
  if (!hacklabRaw) {
    return { status: "error", message: "Your hacklab profile is required." };
  }
  if (!howCanIHelp) {
    return {
      status: "error",
      message: "Tell us how you can be useful to the community.",
    };
  }
  if (!heardAboutUs) {
    return {
      status: "error",
      message: "Tell us how you heard about the community.",
    };
  }
  if (!excitesYouMost) {
    return { status: "error", message: "Tell us what excites you most." };
  }
  if (!rulesRead) {
    return {
      status: "error",
      message: "You have to read the rules first. For real.",
    };
  }
  if (
    name.length > 200 ||
    hacklabRaw.length > 300 ||
    howCanIHelp.length > 2000 ||
    heardAboutUs.length > 1000 ||
    excitesYouMost.length > 2000
  ) {
    return { status: "error", message: "That submission is too long." };
  }

  const hacklabProfile = normalizeUrl(hacklabRaw);
  if (!hacklabProfile) {
    return {
      status: "error",
      message: "That hacklab profile link doesn't look right.",
    };
  }

  const type = typeRaw;

  /*
   * Primary write is Notion (the CRM); Neon is the backup. Either one landing
   * counts as a success — we'd rather double-record an application than lose
   * one.
   */
  const [notionOk, neonOk] = await Promise.all([
    createApplication({
      name,
      type,
      hacklabProfile,
      howCanIHelp,
      heardAboutUs,
      excitesYouMost,
    }),
    backupToNeon(
      name,
      type,
      hacklabProfile,
      howCanIHelp,
      heardAboutUs,
      excitesYouMost
    ),
  ]);

  if (!notionOk && !neonOk) {
    return {
      status: "error",
      message: "Something went wrong. Try again, or email us.",
    };
  }

  return {
    status: "ok",
    message: `Thanks ${name} — you're on the list. We'll be in touch.`,
  };
}
