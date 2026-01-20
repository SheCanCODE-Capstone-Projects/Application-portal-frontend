import RegisterForm from "@/components/auth/RegisterForm";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create an Account | SheCanCODE",
  description: "Create a new account to get started with SheCanCODE",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
