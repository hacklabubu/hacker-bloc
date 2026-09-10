import { BillingForm } from "@/components/site/billing-form";
import { NoMembership, PaymentList } from "@/components/site/space-membership";
import { getSessionUser } from "@/lib/auth";
import { getMemberByEmail } from "@/lib/member-account";

export default async function SpaceBillingPage() {
  const user = await getSessionUser();
  const email = user?.email ?? "";
  const member = await getMemberByEmail(email);

  return (
    <>
      <section className="terminal-section" aria-labelledby="billing-heading">
        <h2 id="billing-heading" className="terminal-legend">Billing</h2>
        <div className="terminal-section-content">
          {member ? <BillingForm /> : <NoMembership email={email} />}
        </div>
      </section>
      {member ? (
        <section className="terminal-section" aria-labelledby="payments-heading">
          <h2 id="payments-heading" className="terminal-legend">Payments</h2>
          <div className="terminal-section-content">
            <PaymentList payments={member.payments} />
          </div>
        </section>
      ) : null}
    </>
  );
}
