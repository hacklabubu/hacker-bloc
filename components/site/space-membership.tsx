import Link from "next/link";
import type { MemberAccount, MemberPayment } from "@/lib/member-account";
import { formatUsd } from "@/lib/membership";

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

export function MemberStatus({ member }: { member: MemberAccount }) {
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

export function NoMembership({ email }: { email: string }) {
  return (
    <>
      <p>
        No membership is linked to {email} yet. If you paid with a different
        email, sign in with that one. Payments can take a minute to show up.
      </p>
      <div className="terminal-actions">
        <Link href="/membership#member" className="terminal-button">
          Become a member <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </>
  );
}

export function PaymentList({ payments }: { payments: MemberPayment[] }) {
  if (payments.length === 0) return <p className="terminal-muted">No payments yet.</p>;
  return (
    <ul className="terminal-perks" aria-label="Payments">
      {payments.map((payment) => (
        <li key={`${payment.paidAt}-${payment.amountCents}`}>
          <span aria-hidden="true">[$]</span>
          <span>
            {formatMoney(payment.amountCents, payment.currency)} on {formatDate(payment.paidAt)}
            {payment.description ? ` — ${payment.description}` : ""}
          </span>
        </li>
      ))}
    </ul>
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

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Warsaw",
  });
}
