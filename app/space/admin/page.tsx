import { notFound } from "next/navigation";
import { setRoleOverride } from "@/app/actions/admin";
import { formatDate } from "@/components/site/space-membership";
import { getSessionUser } from "@/lib/auth";
import { isFounder } from "@/lib/founders";
import { ROLES, getAdminPeople, roleOf } from "@/lib/people";

/* Founders only; everyone else gets the 404 so the page does not exist for them. */
export default async function SpaceAdminPage() {
  const user = await getSessionUser();
  if (!user || !isFounder(user.email)) notFound();
  const people = await getAdminPeople();

  return (
    <>
      <section className="terminal-section" aria-labelledby="admin-heading">
        <h2 id="admin-heading" className="terminal-legend">Accounts</h2>
        <div className="terminal-section-content">
          <p className="terminal-muted">
            Everyone with an account. The role is computed from the founders
            list and the payments (a paid membership makes a member);
            pin any role, or leave &quot;auto&quot;.
          </p>
          {people === null ? (
            <p className="terminal-muted">The database is offline right now.</p>
          ) : people.length === 0 ? (
            <p className="terminal-muted">No accounts yet.</p>
          ) : (
            <div className="terminal-table-wrap">
              <table className="terminal-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>GitHub</th>
                    <th>Since</th>
                    <th>Paid</th>
                    <th>Role</th>
                    <th>Pin</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((person) => (
                    <tr key={person.id}>
                      <td>{person.email}</td>
                      <td>
                        {person.github ? (
                          <a href={`https://github.com/${person.github}`}>{person.github}</a>
                        ) : (
                          <span className="terminal-muted">—</span>
                        )}
                      </td>
                      <td>{formatDate(person.since)}</td>
                      <td className="terminal-muted">
                        {person.membershipStatus ?? "no membership"}
                        {person.patronPayments > 0 ? ` · ${person.patronPayments} patron` : ""}
                      </td>
                      <td>
                        {roleOf(person.status).label.toLowerCase()}
                        {person.override ? <span className="terminal-muted"> (pinned)</span> : <span className="terminal-muted"> (auto)</span>}
                      </td>
                      <td>
                        {/* Keyed on the stored value so the select re-mounts after a save. */}
                        <form
                          key={`${person.id}-${person.override ?? "auto"}`}
                          action={setRoleOverride}
                          className="terminal-inline-form"
                        >
                          <input type="hidden" name="id" value={person.id} />
                          <select name="role" defaultValue={person.override ?? ""} aria-label={`Status for ${person.email}`}>
                            <option value="">auto ({roleOf(person.computed).label.toLowerCase()})</option>
                            {ROLES.map((role) => (
                              <option key={role.id} value={role.id}>{role.label.toLowerCase()}</option>
                            ))}
                          </select>
                          <button type="submit" className="terminal-button">Save</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
