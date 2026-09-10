import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { MemberStatus, NoMembership } from "@/components/site/space-membership";
import { getSessionUser } from "@/lib/auth";
import { getMemberByEmail } from "@/lib/member-account";

export default async function SpaceProfilePage() {
  const user = await getSessionUser();
  const email = user?.email ?? "";
  const member = await getMemberByEmail(email);
  const github = user?.githubUsername ?? null;

  return (
    <>
      <section className="terminal-section" aria-labelledby="profile-heading">
        <h2 id="profile-heading" className="terminal-legend">Profile</h2>
        <div className="terminal-section-content">
          <ul className="terminal-perks" aria-label="Profile">
            <li>
              <span aria-hidden="true">[gh]</span>
              <span>
                {github ? (
                  <a href={`https://github.com/${github}`} className="underline underline-offset-4">
                    {github}
                  </a>
                ) : (
                  <span className="terminal-muted">No GitHub account linked.</span>
                )}
              </span>
            </li>
            <li>
              <span aria-hidden="true">[@]</span>
              <span>{email}</span>
            </li>
          </ul>
          <div className="terminal-actions">
            {user?.provider === "email" ? (
              <Link href="/auth/update-password" className="terminal-button">
                Change password <span aria-hidden="true">↗</span>
              </Link>
            ) : null}
            <LogoutButton />
          </div>
        </div>
      </section>
      <section className="terminal-section" aria-labelledby="status-heading">
        <h2 id="status-heading" className="terminal-legend">Membership</h2>
        <div className="terminal-section-content">
          {member ? <MemberStatus member={member} /> : <NoMembership email={email} />}
        </div>
      </section>
    </>
  );
}
