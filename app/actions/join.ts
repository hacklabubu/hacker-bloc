"use server";

import { isJoinType } from "@/lib/community";
import { getSql } from "@/lib/db";
import { createApplication } from "@/lib/notion";

export type JoinState = {
  status: "idle" | "ok" | "error";
  message: string;
};

/* Deliberately loose — enough to catch typos, not to police valid addresses. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/*
 * Best-effort mirror of the application into the Neon `waitlist` table. Notion
 * is the system of record now; this stays as a backup so a Notion outage (or a
 * missing NOTION_TOKEN) doesn't lose a submission. Never throws.
 */
async function backupToNeon(
  name: string,
  email: string,
  building: string,
  links: string,
  type: string
): Promise<boolean> {
  try {
    const sql = getSql();
    try {
      await sql`
        INSERT INTO waitlist (name, email, building, links, applicant_type)
        VALUES (${name}, ${email}, ${building}, ${links}, ${type})
      `;
      return true;
    } catch {
      /* Schema may not have email yet — retry without it. */
    }
    try {
      await sql`
        INSERT INTO waitlist (name, building, links, applicant_type)
        VALUES (${name}, ${building}, ${links}, ${type})
      `;
      return true;
    } catch {
      /* Schema may not have applicant_type either — prefix into building. */
    }
    await sql`
      INSERT INTO waitlist (name, building, links)
      VALUES (${name}, ${`[${type}] ${email} ${building}`}, ${links})
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
  const email = String(formData.get("email") ?? "").trim();
  const building = String(formData.get("building") ?? "").trim();
  const links = String(formData.get("links") ?? "").trim();
  const typeRaw = String(formData.get("type") ?? "").trim();

  if (!isJoinType(typeRaw)) {
    return { status: "error", message: "Please select what type you are." };
  }
  if (!name || !building) {
    return {
      status: "error",
      message: "Name and what you're building are required.",
    };
  }
  if (!email) {
    return { status: "error", message: "Email is required." };
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "error", message: "That email doesn't look right." };
  }
  if (name.length > 200 || building.length > 2000 || links.length > 1000) {
    return { status: "error", message: "That submission is too long." };
  }

  const type = typeRaw;

  /*
   * Primary write is Notion (the CRM); Neon is the backup. Either one landing
   * counts as a success — we'd rather double-record an application than lose
   * one.
   */
  const [notionOk, neonOk] = await Promise.all([
    createApplication({ name, email, type, building, links }),
    backupToNeon(name, email, building, links, type),
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
