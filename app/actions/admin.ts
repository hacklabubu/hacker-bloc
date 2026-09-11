"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { getSql } from "@/lib/db";
import { isFounder } from "@/lib/founders";
import { isStatus } from "@/lib/people";

/*
 * Founders pin or clear an account's status from /space/admin. The public
 * list (/members) honours the override over the computed one.
 */
export async function setRoleOverride(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user || !isFounder(user.email)) throw new Error("Founders only.");

  const id = String(formData.get("id") ?? "");
  const raw = String(formData.get("role") ?? "");
  const role = raw === "" ? null : isStatus(raw) ? raw : undefined;
  if (!id || role === undefined) throw new Error("Bad request.");

  const sql = getSql();
  await sql`
    UPDATE profiles SET role_override = ${role}, updated_at = now()
    WHERE supabase_user_id = ${id}
  `;
  revalidatePath("/members");
  revalidatePath("/space/admin");
}
