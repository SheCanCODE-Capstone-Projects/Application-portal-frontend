import { Metadata } from 'next';
import EmailVerification from "@/components/auth/EmailVerification";
import {AuroraBackground} from "@/components/background/page";

export const metadata: Metadata = {
  title: "Verify Email | SheCanCODE",
  description: "Verify your email address for SheCanCODE",
};

export default function VerifyEmailPage() {

  return (
      <>
        <AuroraBackground className="px-3 sm:px-4">
        <EmailVerification />;
        </AuroraBackground>
      </>

  )
}
