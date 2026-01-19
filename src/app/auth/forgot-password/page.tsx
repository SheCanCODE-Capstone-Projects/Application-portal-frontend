import { Metadata } from 'next';
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import PublicRoute from "@/guards/PublicRoute";

export const metadata: Metadata = {
  title: "Forgot Password | SheCanCODE",
  description: "Reset your SheCanCODE account password",
};

export default function ForgotPasswordPage() {
  return (
    <PublicRoute>
      <ForgotPasswordForm />
    </PublicRoute>
  );
}
