"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { loginRequest } from "@/lib/api";

type FieldErrors = {
  email?: string;
  password?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation state
  const isFormValid = useMemo(() => {
    return emailRegex.test(email) && password.length > 0;
  }, [email, password]);

  // Validate fields before submitting
  const validate = () => {
    const errors: FieldErrors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = await loginRequest({
        email: email.trim(),
        password,
        rememberMe,
      });

      // 👉 Store JWT in localStorage
      if (result.token) {
        localStorage.setItem("jwt", result.token);
      }

      // 👉 Redirect based on user role
      const role = result.user?.role?.toLowerCase();
      const destination =
        role === "admin" ? "/admin/dashboard" : "/applicant/dashboard";

      router.push(destination);

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while logging in.";

      setFormError(message);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1ed] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-[#d7cfc8]">
        <div className="mb-8 text-center">
          <h1 className="mt-3 text-3xl font-semibold text-[#0f5d3f]">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-[#3f3f3f]">
            Sign in to access your account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#0f5d3f]"
            >
              Email address *
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#c8c0b9] bg-white px-3 py-2 text-sm text-[#0f5d3f] shadow-sm focus:border-[#d97700] focus:ring-2 focus:ring-[#d97700]/40"
            />

            {fieldErrors.email && (
              <p className="text-sm text-[#c2410c]">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#0f5d3f]"
            >
              Password *
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border text-[#0f5d3f] border-[#c8c0b9] bg-white px-3 py-2 text-sm shadow-sm focus:border-[#d97700] focus:ring-2 focus:ring-[#d97700]/40"
            />

            {fieldErrors.password && (
              <p className="text-sm text-[#c2410c]">{fieldErrors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-[#0d2f20]">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <Link
              href="/auth/forgot-password"
              className="font-medium text-[#d97700] hover:text-[#b35f00]"
            >
              Forgot password?
            </Link>
          </div>

          {formError && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full rounded-full bg-[#0f5d3f] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#0a4330] disabled:bg-gray-400"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#0d2f20]">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-[#d97700] hover:text-[#b35f00]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
