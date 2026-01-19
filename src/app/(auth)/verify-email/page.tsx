import { Metadata } from 'next';
import EmailVerification from "@/app/components/auth/EmailVerification";

export const metadata: Metadata = {
  title: "Verify Email | SheCanCODE",
  description: "Verify your email address for SheCanCODE",
};

export default function VerifyEmailPage() {
  return <EmailVerification />;
}
