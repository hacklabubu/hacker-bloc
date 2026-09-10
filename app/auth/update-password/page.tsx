import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/update-password-form";
import { AuthPage } from "@/components/site/auth-page";

export const metadata: Metadata = {
  title: "New password",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AuthPage title="Choose a new password." legend="New password">
      <UpdatePasswordForm />
    </AuthPage>
  );
}
