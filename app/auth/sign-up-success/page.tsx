import type { Metadata } from "next";
import Link from "next/link";
import { AuthPage } from "@/components/site/auth-page";

export const metadata: Metadata = {
  title: "Check your email",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AuthPage title="Check your email." legend="One more step">
      <p>
        We sent a confirmation link. Open it and you are signed in; if you came
        from the membership page, it takes you straight back there to pay.
        Later, <Link href="/auth/login" className="underline underline-offset-4">sign in</Link> any time.
      </p>
    </AuthPage>
  );
}
