import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: TERMS.title,
  description: TERMS.description,
  alternates: { canonical: TERMS.path },
};

export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}
