import RegisterForm from "@/components/auth/RegisterForm";

import { Metadata } from 'next';
import {AuroraBackground} from "@/components/background/page";

export const metadata: Metadata = {
  title: "Create an Account | SheCanCODE",
  description: "Create a new account to get started with SheCanCODE",
};

export default function RegisterPage() {
  return (
      <AuroraBackground className="px-3 sm:px-4">
      <RegisterForm />
        </AuroraBackground>
  )
}
