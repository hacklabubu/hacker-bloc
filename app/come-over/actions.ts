"use server";

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

  if (!name || !building) {
    return {
      status: "error",
      message: "name and what you're building are required. links optional.",
    };
  }
  if (name.length > 200 || building.length > 2000 || links.length > 1000) {
    return { status: "error", message: "easy — that's too long for the log." };
  }

  try {
    const sql = getSql();
    await sql`INSERT INTO waitlist (name, building, links) VALUES (${name}, ${building}, ${links})`;
  } catch {
    return {
      status: "error",
      message: "db offline. try again, or just show up in person.",
    };
  }

  return {
    status: "ok",
    message: `ack ${name} — you're on the wall. we'll ping you before the next wave.`,
  };
}
