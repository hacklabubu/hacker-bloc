import { notFound } from "next/navigation";
import { setRoleOverride } from "@/app/actions/admin";
import { formatDate } from "@/components/site/space-membership";
import { getSessionUser } from "@/lib/auth";
import { isFounder } from "@/lib/founders";
import { STATUSES, getAdminPeople } from "@/lib/people";

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
            Everyone with an account. Status is computed from payments and the
            founders list; pin founder, resident, member, patron or lurker, or
            leave &quot;auto&quot;.
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
                    <th>Status</th>
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
                        <form action={setRoleOverride} className="terminal-inline-form">
                          <input type="hidden" name="id" value={person.id} />
                          <select name="role" defaultValue={person.override ?? ""} aria-label={`Status for ${person.email}`}>
                            <option value="">auto ({person.computed})</option>
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>{status}</option>
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
