import type { Metadata } from "next";
import { SignUpForm } from "@/components/sign-up-form";
import { GitHubButton } from "@/components/site/github-button";
import { AuthPage } from "@/components/site/auth-page";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AuthPage title="Create your member account." legend="Create account">
      <GitHubButton label="Sign up with GitHub" />
      <p className="terminal-or">Or with email and password:</p>
      <SignUpForm />
    </AuthPage>
  );
}
