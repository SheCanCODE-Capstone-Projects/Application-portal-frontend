"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { resetPassword } from "@/lib/api";

const passwordMinLength = 8;

const hasNumber = (value: string) => /\d/.test(value);
const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasLowercase = (value: string) => /[a-z]/.test(value);
const hasSpecialChar = (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value);

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    // Extract token from URL when component mounts
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError("Invalid or missing reset token. Please use the link from your email.");
    }
  }, [searchParams]);

  useEffect(() => {
    // Update password validation state
    setPasswordValidation({
      hasMinLength: password.length >= passwordMinLength,
      hasNumber: hasNumber(password),
      hasUppercase: hasUppercase(password),
      hasLowercase: hasLowercase(password),
      hasSpecialChar: hasSpecialChar(password),
    });
  }, [password]);

  const validate = (): boolean => {
    // Check if token exists
    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Check if password meets all requirements
    const isValidPassword = 
      password.length >= passwordMinLength &&
      hasNumber(password) &&
      hasUppercase(password) &&
      hasLowercase(password) &&
      hasSpecialChar(password);

    if (!isValidPassword) {
      setError("Please ensure your password meets all requirements");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      await resetPassword({
        token,
        password,
        confirmPassword,
      });
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f1ed] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-[#d7cfc8]">
          <div className="mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[#0f5d3f]">
              Password Reset Successful!
            </h2>
            <p className="mt-2 text-gray-600">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-md border border-transparent bg-[#0f5d3f] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0d4e35] focus:outline-none focus:ring-2 focus:ring-[#0f5d3f] focus:ring-offset-2"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f1ed] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-[#d7cfc8]">
          <div className="mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-red-600">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-gray-600">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center rounded-md border border-transparent bg-[#0f5d3f] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0d4e35] focus:outline-none focus:ring-2 focus:ring-[#0f5d3f] focus:ring-offset-2"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1ed] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-[#d7cfc8]">
        <div className="mb-8 text-center">
          <h1 className="mt-3 text-3xl font-semibold text-[#0f5d3f]">
            Reset Your Password
          </h1>
          <p className="mt-2 text-sm text-[#3f3f3f]">
            Create a new password for your account
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#0f5d3f] focus:ring-[#0f5d3f] sm:text-sm"
              />
              <div className="mt-2 text-xs text-gray-500">
                Password must contain:
                <ul className="ml-4 list-disc">
                  <li className={passwordValidation.hasNumber ? "text-green-600" : ""}>
                    At least one number
                  </li>
                  <li className={passwordValidation.hasUppercase ? "text-green-600" : ""}>
                    At least one uppercase letter
                  </li>
                  <li className={passwordValidation.hasLowercase ? "text-green-600" : ""}>
                    At least one lowercase letter
                  </li>
                  <li className={passwordValidation.hasSpecialChar ? "text-green-600" : ""}>
                    At least one special character
                  </li>
                  <li className={passwordValidation.hasMinLength ? "text-green-600" : ""}>
                    At least {passwordMinLength} characters long
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#0f5d3f] focus:ring-[#0f5d3f] sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full justify-center rounded-md border border-transparent ${
                isSubmitting
                  ? "bg-[#0f5d3f] opacity-70"
                  : "bg-[#0f5d3f] hover:bg-[#0d4e35]"
              } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f5d3f] focus:ring-offset-2`}
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-[#d97700] hover:text-[#b35f00]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
