"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/lib/api";

export default function EmailVerification() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState<string>("Verifying your email address...");

  useEffect(() => {
    const verifyToken = async () => {
      // Extract token from URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setMessage(
            "Invalid verification link. Please check your email for the correct link."
        );
        return;
      }

      try {
        const result = await verifyEmail(token);
        setStatus("success");
        setMessage(
            result.message ||
            "Your email has been successfully verified! You can now log in to your account."
        );
      } catch (error: unknown) {
        setStatus("error");
        setMessage(
            "Failed to verify email. The link may be invalid or expired."
        );
      }
    };

    verifyToken();
  }, []);


  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1ed] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-[#d7cfc8]">
        <div className="mb-6">
          {status === "verifying" && (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 animate-spin text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}

          {status === "success" && (
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
          )}

          {status === "error" && (
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
          )}

          <h2 className="mt-4 text-2xl font-bold text-[#0f5d3f]">
            {status === "verifying"
              ? "Verifying Your Email"
              : status === "success"
              ? "Email Verified!"
              : "Verification Failed"}
          </h2>
          <p className="mt-2 text-gray-600">{message}</p>
        </div>

        <div className="mt-6">
          {status === "success" ? (
            <Link
              href="/src/app/(auth)/login"
              className="inline-flex items-center rounded-md border border-transparent bg-[#0f5d3f] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0d4e35] focus:outline-none focus:ring-2 focus:ring-[#0f5d3f] focus:ring-offset-2"
            >
              Continue to Login
            </Link>
          ) : status === "error" ? (
            <div className="space-y-3">
              <Link
                href="/src/app/(auth)/register"
                className="inline-flex items-center rounded-md border border-transparent bg-[#0f5d3f] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0d4e35] focus:outline-none focus:ring-2 focus:ring-[#0f5d3f] focus:ring-offset-2"
              >
                Create New Account
              </Link>
              <p className="mt-2 text-sm text-gray-600">
                Need help?{" "}
                <a
                  href="mailto:support@shecancode.org"
                  className="font-semibold text-[#d97700] hover:text-[#b35f00]"
                >
                  Contact Support
                </a>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
