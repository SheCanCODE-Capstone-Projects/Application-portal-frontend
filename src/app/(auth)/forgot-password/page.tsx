import { Metadata } from 'next';
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import {AuroraBackground} from "@/components/background/page";

export const metadata: Metadata = {
  title: "Forgot Password | SheCanCODE",
  description: "Reset your SheCanCODE account password",
};

export default function ForgotPasswordPage() {
  return (
      <AuroraBackground className="px-3 sm:px-4">
      <ForgotPasswordForm />
      </AuroraBackground>
  )
}
