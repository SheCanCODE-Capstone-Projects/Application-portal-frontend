"use client";

import React, { useState } from "react";
import {useForgotPassword} from "@/hooks/auth/forgotPassword";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loading, sendResetLink } = useForgotPassword();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Enter a valid email");
      return;
    }

    try {
      await sendResetLink(email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  if (success) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10 z-30">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-[#d7cfc8]">
            <h2 className="text-2xl font-bold text-green-600">Check Your Email</h2>
            <p className="mt-2 text-gray-600">
              We&#39;ve sent a password reset link to <strong>{email}</strong>.
            </p>
            <p className="mt-2 text-gray-500">Please follow the instructions to reset your password.</p>
          </div>
        </div>
    );
  }

  return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10 z-30">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-[#d7cfc8]">
          <h1 className="text-3xl font-semibold text-[#0f5d3f] mb-2">Forgot Password</h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter your email to receive a password reset link.
          </p>

          {error && <div className="text-red-600 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#0f5d3f] focus:ring-[#0f5d3f]"
            />
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white ${
                    loading ? "bg-[#0f5d3f] opacity-70" : "bg-[#0f5d3f] hover:bg-[#0d4e35]"
                }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
  );
}
