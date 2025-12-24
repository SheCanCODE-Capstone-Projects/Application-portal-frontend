"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/lib/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
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
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
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
              Check Your Email
            </h2>
            <p className="mt-2 text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-[#0f5d3f] hover:text-[#0d4e35]"
            >
              Back to Login
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
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-[#3f3f3f]">
            Enter your email and we'll send you a link to reset your password
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
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full text-[#0f5d3f]  rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#0f5d3f] focus:ring-[#0f5d3f] sm:text-sm"
                placeholder="Enter your email"
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
              {isSubmitting ? "Sending..." : "Send Reset Link"}
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
