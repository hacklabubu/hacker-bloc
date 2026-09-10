import type { Metadata } from "next";
import { SignUpForm } from "@/components/sign-up-form";
import { AuthPage } from "@/components/site/auth-page";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AuthPage title="Create your member account." legend="Create account">
      <p className="terminal-muted">
        Use the email you paid with so your membership shows up.
      </p>
      <SignUpForm />
    </AuthPage>
  );
}
