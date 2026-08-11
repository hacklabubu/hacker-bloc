"use server";

import { isJoinType } from "@/lib/community";
import { getSql } from "@/lib/db";

export type JoinState = {
  status: "idle" | "ok" | "error";
  message: string;
};

export async function joinWaitlist(
  _prev: JoinState,
  formData: FormData
): Promise<JoinState> {
  const name = String(formData.get("name") ?? "").trim();
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
  if (name.length > 200 || building.length > 2000 || links.length > 1000) {
    return { status: "error", message: "That submission is too long." };
  }

  const type = typeRaw;

  try {
    const sql = getSql();
    try {
      await sql`
        INSERT INTO waitlist (name, building, links, applicant_type)
        VALUES (${name}, ${building}, ${links}, ${type})
      `;
    } catch {
      /* Schema may not have applicant_type yet — prefix into building. */
      await sql`
        INSERT INTO waitlist (name, building, links)
        VALUES (${name}, ${`[${type}] ${building}`}, ${links})
      `;
    }
  } catch {
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
