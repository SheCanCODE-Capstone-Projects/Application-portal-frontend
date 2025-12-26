import { Metadata } from 'next';
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | SheCanCODE",
  description: "Reset your SheCanCODE account password",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
