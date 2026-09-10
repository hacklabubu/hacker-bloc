import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BillingForm } from "@/components/site/billing-form";
import { LogoutButton } from "@/components/logout-button";
import { getMemberByEmail, type MemberAccount } from "@/lib/member-account";
import { formatUsd } from "@/lib/membership";
import { createClient } from "@/lib/supabase/server";

/* Reads the session cookie on every request; never prerender. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members",
  description: "Your Hacker Bloc membership and billing.",
  robots: { index: false, follow: false },
};

/*
 * The members area. Sign-in is Supabase Auth (app/auth); the membership data
 * is the Stripe mirror in Neon, matched by the email the member signed in with.
 * Billing itself lives in Stripe's Customer Portal (app/actions/billing.ts).
 */
export default async function MembersPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return (
      <main id="top" className="terminal-page">
        <section className="terminal-intro" aria-labelledby="members-heading">
          <p className="terminal-location">Members</p>
          <h1 id="members-heading">Member login opens soon.</h1>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/auth/login?next=/members");
  const email = typeof data.claims.email === "string" ? data.claims.email : "";
  const member = await getMemberByEmail(email);

  return (
    <main id="top" className="terminal-page">
      <section className="terminal-intro" aria-labelledby="members-heading">
        <p className="terminal-location">Members</p>
        <h1 id="members-heading">
          {member?.name ? `Hello, ${member.name}.` : "Hello."}
        </h1>
        <p className="terminal-muted">Signed in as {email}.</p>
      </section>

      <section id="membership" className="terminal-section" aria-labelledby="status-heading">
        <h2 id="status-heading" className="terminal-legend">Membership</h2>
        <div className="terminal-section-content">
          {member ? <MemberStatus member={member} /> : <NoMembership email={email} />}
        </div>
      </section>

      {member ? (
        <section id="billing" className="terminal-section" aria-labelledby="billing-heading">
          <h2 id="billing-heading" className="terminal-legend">Billing</h2>
          <div className="terminal-section-content">
            <BillingForm />
            {member.payments.length > 0 ? (
              <ul className="terminal-perks" aria-label="Payments">
                {member.payments.map((payment) => (
                  <li key={`${payment.paidAt}-${payment.amountCents}`}>
                    <span aria-hidden="true">[$]</span>
                    <span>
                      {formatMoney(payment.amountCents, payment.currency)} on {formatDate(payment.paidAt)}
                      {payment.description ? ` — ${payment.description}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      <section id="account" className="terminal-section" aria-labelledby="account-heading">
        <h2 id="account-heading" className="terminal-legend">Account</h2>
        <div className="terminal-section-content terminal-actions">
          <Link href="/auth/update-password" className="underline underline-offset-4">
            Change password
          </Link>
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  trialing: "Active (first month paid up front)",
  past_due: "Payment overdue",
  unpaid: "Unpaid",
  canceled: "Canceled",
  incomplete: "Payment not completed",
  incomplete_expired: "Payment not completed",
  paused: "Paused",
  pending: "Pending",
};

function MemberStatus({ member }: { member: MemberAccount }) {
  return (
    <ul className="terminal-perks" aria-label="Membership status">
      <li>
        <span aria-hidden="true">[+]</span>
        <span>Status: {STATUS_LABEL[member.status] ?? member.status}</span>
      </li>
      {member.signupPaidAt ? (
        <li>
          <span aria-hidden="true">[+]</span>
          <span>Member since {formatDate(member.signupPaidAt)}</span>
        </li>
      ) : null}
      {member.canceledAt ? (
        <li>
          <span aria-hidden="true">[-]</span>
          <span>Canceled on {formatDate(member.canceledAt)}</span>
        </li>
      ) : member.currentPeriodEnd ? (
        <li>
          <span aria-hidden="true">[+]</span>
          <span>Paid through {formatDate(member.currentPeriodEnd)}</span>
        </li>
      ) : null}
    </ul>
  );
}

function NoMembership({ email }: { email: string }) {
  return (
    <>
      <p>
        No membership is linked to {email} yet. If you paid with a different
        email, sign in with that one. Payments can take a minute to show up.
      </p>
      <p className="terminal-muted">
        Not a member yet?{" "}
        <Link href="/membership#member" className="underline underline-offset-4">
          Become one
        </Link>
        .
      </p>
    </>
  );
}

function formatMoney(cents: number, currency: string) {
  if (currency.toLowerCase() === "usd") return formatUsd(cents / 100);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Warsaw",
  });
}
