import LoginForm from "@/components/auth/LoginForm";
import PublicRoute from "@/guards/PublicRoute";

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}

