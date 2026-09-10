import type { Metadata } from "next";
import Link from "next/link";
import { AuthPage } from "@/components/site/auth-page";

export const metadata: Metadata = {
  title: "Sign-in error",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthPage title="That link did not work." legend="Sign-in error">
      <p className="terminal-muted">{params.error ?? "The link may have expired."}</p>
      <p>
        <Link href="/auth/login" className="underline underline-offset-4">Sign in</Link> or{" "}
        <Link href="/auth/forgot-password" className="underline underline-offset-4">request a new link</Link>.
      </p>
    </AuthPage>
  );
}
