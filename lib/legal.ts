/*
 * The legal pages, authored once as data so /terms and /refunds render the
 * same words as HTML (components/site/legal-page.tsx) and as markdown
 * (lib/markdown.ts). Paragraphs are plain text with markdown-style links
 * `[label](href)`; nothing else is parsed.
 *
 * What the words must cover, and why:
 *   - Polish act on providing services by electronic means, art. 8: a
 *     "regulamin" naming the service, technical requirements, how the contract
 *     starts and ends, and how complaints work.
 *   - Consumer Rights Act (implementing directive 2011/83/EU): pre-contract
 *     information, the 14-day withdrawal right, the online withdrawal function
 *     (directive 2023/2673, in force since 19 June 2026), 14-day complaint
 *     answers, no ODR platform link (the EU platform closed in July 2025).
 *   - Stripe's website requirements: business name, what is sold, currency,
 *     contact, cancellation and refund policy, terms, privacy.
 *
 * Not legal advice. Have a Polish lawyer read it before live payments.
 */

import { MEMBERSHIP, formatUsd } from "@/lib/membership";
import { OPERATOR, SITE } from "@/lib/site";

export type LegalSection = { heading: string; paragraphs: readonly string[] };
export type LegalDoc = {
  path: string;
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
};

const signup = formatUsd(MEMBERSHIP.signupUsd);
const monthly = formatUsd(MEMBERSHIP.monthlyUsd);
const operator = OPERATOR.registration
  ? `${OPERATOR.legalName} (${OPERATOR.registration}), ${OPERATOR.address}, ${OPERATOR.country}`
  : `${OPERATOR.legalName}, ${OPERATOR.address}, ${OPERATOR.country}`;

/* The mailto a member uses to cancel or withdraw: subject and body pre-filled
 * so the message carries everything we need to find the subscription. */
export function withdrawalMailto(subject: string, body: string): string {
  return `mailto:${OPERATOR.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const CANCEL_MAILTO = withdrawalMailto(
  "Cancel my Hacker Bloc membership",
  "Please cancel my membership at the end of the current billing period.\n\nName:\nEmail used at checkout:\n"
);

export const WITHDRAW_MAILTO = withdrawalMailto(
  "Withdrawal from Hacker Bloc membership contract",
  "I hereby withdraw from the membership contract.\n\nName:\nEmail used at checkout:\nDate of payment:\n"
);

export const TERMS: LegalDoc = {
  path: "/terms",
  title: "Membership terms",
  description:
    "The terms of a Hacker Bloc membership: who you contract with, what you get, what it costs, how billing works, how to cancel, and what happens if the house closes.",
  updated: "2026-09-10",
  intro:
    "Plain-language terms for paying members of the Bloc. They apply from the moment you complete checkout. The house rules apply on top of them.",
  sections: [
    {
      heading: "Who you are dealing with",
      paragraphs: [
        `Hacker Bloc is operated by ${operator}. Write to ${OPERATOR.email} for anything in these terms; that address is the customer service contact for payments, cancellations, complaints, and questions.`,
        `These terms, the [house rules](/rules), the [cancellation and refund policy](/refunds), and the [privacy policy](/privacy) together form the membership contract. If they conflict, these terms win over the house rules, and the refund policy wins over these terms on anything about money coming back.`,
      ],
    },
    {
      heading: "What a membership is",
      paragraphs: [
        `A membership gives one named person round-the-clock access to the hackerspace at ${SITE.address}, entry to every event we run there, and a say in what the space buys and builds next, for as long as the membership is active. Access is personal and cannot be lent, shared, or resold.`,
        `A membership is not a tenancy, a lease, a coworking desk licence, or an investment. It gives you no right to live in the house, no exclusive desk or room, no equity, and no share of anything the house earns or owns.`,
        "The space is run by the people who live and work in it. Opening hours, layout, equipment, and event programming change as the house develops; the [roadmap](/roadmap) shows what unlocks as members join. We will tell members about material changes by email before they happen.",
      ],
    },
    {
      heading: "Who can join",
      paragraphs: [
        `You must be at least 18 years old and able to enter a binding contract. Membership is capped at ${MEMBERSHIP.limit} people and we may refuse or end a membership for anyone we believe is not a fit for the house, with the refund consequences set out in the refund policy.`,
        "Where you pay through a company, the company is the member's sponsor but the access is still tied to the named person, and the consumer rights below do not apply to the company.",
      ],
    },
    {
      heading: "Price and billing",
      paragraphs: [
        `The price is ${signup} once, then ${monthly} per month. Amounts are in US dollars and include VAT where it applies. Payment is by card through Stripe, which hosts the checkout; we never see your card number.`,
        `At checkout you pay the ${signup} signup fee, and nothing else. Exactly one month after checkout your card is charged the first ${monthly}, and the same amount is charged automatically on the same day of every month after that, until the membership ends. Your receipts come from Stripe by email.`,
        "If a monthly charge fails, Stripe retries it over the following days and emails you to update the card. While a payment is overdue your access is paused. If the payment is still missing after Stripe's retries end, the membership is cancelled for non-payment.",
        "We may change the monthly price with at least 30 days' notice by email. A price change never applies to a period you have already paid for, and you can cancel before it takes effect.",
      ],
    },
    {
      heading: "Term and cancellation",
      paragraphs: [
        "The membership runs month to month from the day you paid the signup fee. Either side can end it.",
        `You can cancel at any time by emailing ${OPERATOR.email} from the address you used at checkout, or by using the cancel link on the [refund policy page](/refunds). Cancellation takes effect at the end of the monthly period you have already paid for; you keep access until then, and no further charges are taken. Paid periods and the signup fee are not refunded, except where the refund policy or the law says otherwise.`,
        "We can end a membership for a serious or repeated breach of the house rules, for non-payment, or for behaviour that endangers people or the space. Where the breach can be fixed we will warn you first and give you a chance to fix it. Where it cannot, access ends immediately. The refund policy says what, if anything, comes back.",
      ],
    },
    {
      heading: "If the house closes",
      paragraphs: [
        "Our landlord is looking for a buyer for the house. We are trying to buy it. If we lose the space, we will try to move the Bloc elsewhere in Warsaw; if we cannot, all memberships end on the day the space closes.",
        `When memberships end this way, monthly billing stops immediately and any part of the current month you have already paid for is refunded on a daily pro-rata basis. The ${signup} signup fee is a contribution to setting the space up and is not refunded. This is the risk you take by joining early, and it is explained again on the [membership page](/membership#risk) before you pay.`,
      ],
    },
    {
      heading: "Your right to withdraw",
      paragraphs: [
        "If you are a consumer, you have the legal right to withdraw from this contract within 14 days of the day you paid, without giving a reason. How to do it, and what is refunded when you do, is set out in the [cancellation and refund policy](/refunds), which also has the withdrawal form and the withdrawal button.",
        "Because access starts as soon as you pay, you agree that we begin providing the service immediately, before the 14-day period ends. If you then withdraw, you pay only for the part of the service used up to the moment you withdrew, and we refund the rest.",
      ],
    },
    {
      heading: "Using the space",
      paragraphs: [
        "You use the space, its tools, and its equipment at your own risk and in line with the house rules and any safety instructions on the equipment. Do not use a machine you have not been shown how to use. Keep your own belongings safe; we do not insure them.",
        "You are responsible for damage you cause to the space or its equipment through carelessness or on purpose. Normal wear is on us.",
        "You must not use the space or this site for anything unlawful, and must not submit unlawful content through any form on this site.",
      ],
    },
    {
      heading: "Our liability",
      paragraphs: [
        "Nothing in these terms limits our liability where the law does not allow it, including for death or personal injury caused by our negligence, or for damage we cause on purpose.",
        "Otherwise, our liability to you for anything arising from the membership is limited to the amount you paid us in the 12 months before the event giving rise to the claim. We are not liable for loss of business, profit, data, or opportunities. This limitation does not apply to consumers to the extent consumer law does not allow it.",
      ],
    },
    {
      heading: "Complaints",
      paragraphs: [
        `Send complaints to ${OPERATOR.email}. Tell us what went wrong, when, and what you would like us to do. We answer within 14 days. If we do not, the complaint counts as accepted.`,
        "If you are a consumer in Poland and we cannot sort it out, you can ask the Trade Inspection (Inspekcja Handlowa) for out-of-court dispute resolution or turn to your municipal or district consumer ombudsman (rzecznik konsumentów), both free of charge. Consumers elsewhere in the EU keep the protections of their home country.",
      ],
    },
    {
      heading: "Technical requirements",
      paragraphs: [
        "To become and stay a member you need a device with a current web browser, an email address you check, and a payment card that Stripe accepts. Checkout, receipts, and all notices under these terms are delivered by email or on this site.",
      ],
    },
    {
      heading: "Changes to these terms",
      paragraphs: [
        "We may update these terms for legal, safety, or operational reasons. We will email members at least 14 days before a change takes effect. If you do not accept the change, cancel before that date and the old terms apply until your paid period ends. The current version is always at this address, with its date at the top.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "Polish law applies to these terms and to the membership. Disputes go to the Polish courts. If you are a consumer, nothing here takes away the mandatory protections of the country you live in, or your right to sue in that country.",
      ],
    },
  ],
};

export const REFUNDS: LegalDoc = {
  path: "/refunds",
  title: "Cancellation and refunds",
  description:
    "How to cancel a Hacker Bloc membership, the 14-day withdrawal right, what is refunded and what is not, and how patron contributions work.",
  updated: "2026-09-10",
  intro:
    "Cancel whenever you like and keep access until the end of the month you paid for. Money already paid stays paid, with the exceptions below, which the law and fairness require.",
  sections: [
    {
      heading: "Cancelling a membership",
      paragraphs: [
        `Email ${OPERATOR.email} from the address you used at checkout and say you want to cancel. You can use the pre-filled [cancel link](cancel). We cancel the subscription in Stripe within two business days and confirm by email.`,
        "Cancellation takes effect at the end of the monthly period you have already paid for. You keep access until then. No further charges are taken. The period you are in, and the signup fee, are not refunded.",
      ],
    },
    {
      heading: "Withdrawing within 14 days (consumers)",
      paragraphs: [
        "If you joined as a consumer, meaning for yourself and not for a business, you can withdraw from the membership contract within 14 days of the day you paid the signup fee, without giving a reason.",
        `To withdraw, use the [withdrawal button](withdraw) or email ${OPERATOR.email} with a clear statement that you are withdrawing, your name, and the email you used at checkout. You can also use the model form at the bottom of this page. Sending the message before the 14 days end is enough; we confirm receipt by email.`,
        "Because access starts the moment you pay and you agreed to that at checkout, you owe us a proportionate amount for the days between payment and withdrawal, calculated as the number of days used divided by 30, applied to the signup fee and to the first monthly fee. We refund the rest to the card you paid with within 14 days of receiving your withdrawal, and cancel the subscription so nothing further is charged.",
        "The withdrawal right does not apply where the member is a company or someone joining for their business.",
      ],
    },
    {
      heading: "What we refund, and what we do not",
      paragraphs: [
        "After the 14-day withdrawal period, the signup fee and any paid monthly period are not refunded when you cancel. Your access continues to the end of the period you paid for.",
        "If we end your membership for a breach of the house rules or for non-payment, nothing is refunded.",
        "If we end your membership for any other reason, or if the house closes and we cannot relocate the Bloc, we refund the unused part of the current month on a daily pro-rata basis. The signup fee is not refunded in either case; it was a contribution to setting the space up, as explained before you paid.",
        "If we charged you by mistake, or charged the wrong amount, tell us and we refund the difference in full.",
        "Refunds go back to the card used at checkout and usually appear within 5 to 10 business days of us issuing them, depending on your bank.",
      ],
    },
    {
      heading: "Patron contributions",
      paragraphs: [
        "A patron contribution is a one-off gift to the space. It buys nothing and is not refundable, except where it was made by mistake or in the wrong amount, in which case write to us within 14 days and we return it.",
      ],
    },
    {
      heading: "Chargebacks",
      paragraphs: [
        "Please write to us before disputing a charge with your bank. We answer within 14 days and fix genuine mistakes without argument. A chargeback filed on a charge you agreed to will be contested, and ends the membership.",
      ],
    },
    {
      heading: "Model withdrawal form",
      paragraphs: [
        `To: ${operator}, ${OPERATOR.email}.`,
        "I hereby give notice that I withdraw from my contract for Hacker Bloc membership. Ordered on (date of payment): ___. Name of consumer: ___. Address of consumer: ___. Email used at checkout: ___. Signature (only if sent on paper): ___. Date: ___.",
      ],
    },
  ],
};
