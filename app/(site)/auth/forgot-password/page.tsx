import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { AuthPage } from "@/components/site/auth-page";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AuthPage title="Reset your password." legend="Reset password">
      <ForgotPasswordForm />
    </AuthPage>
  );
}
