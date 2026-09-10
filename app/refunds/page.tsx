import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { REFUNDS } from "@/lib/legal";

export const metadata: Metadata = {
  title: REFUNDS.title,
  description: REFUNDS.description,
  alternates: { canonical: REFUNDS.path },
};

export default function RefundsPage() {
  return <LegalPage doc={REFUNDS} withdrawal />;
}
