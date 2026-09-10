import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { GitHubButton } from "@/components/site/github-button";
import { AuthPage } from "@/components/site/auth-page";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AuthPage title="Sign in to your membership." legend="Sign in">
      <GitHubButton />
      <p className="terminal-muted">Or with email and password:</p>
      <LoginForm />
    </AuthPage>
  );
}
