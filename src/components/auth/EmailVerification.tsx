"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { emailAuthApi } from "@/api/auth/email";
import { getErrorMessage } from "@/utils/errors";

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !email) {
      setStatus('error');
      setMessage('Please enter the verification code.');
      return;
    }

    setStatus('verifying');
    setMessage('Verifying your email address...');

    try {
      const result = await emailAuthApi.verifyEmail({ email, code });
      setStatus("success");
      setMessage(result.message || "Your email has been successfully verified!");
    } catch (error: unknown) {
      setStatus("error");
      setMessage(getErrorMessage(error));
    }
  };

  const handleResend = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const result = await emailAuthApi.resendVerification({ email });
      setMessage(result.message || 'Verification code resent successfully!');
      setStatus('idle');
    } catch (error) {
      setMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      setIsResending(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1ed] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-[#d7cfc8]">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-[#0f5d3f]">
            Verify Your Email
          </h2>
          <p className="mt-2 text-gray-600">
            We sent a verification code to <strong>{email}</strong>
          </p>
        </div>

        {status !== 'success' && (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="mt-1 block w-full text-[#0f5d3f] rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#0f5d3f] focus:ring-[#0f5d3f] sm:text-sm"
              />
            </div>

            {message && (
              <div className={`rounded-md p-4 ${
                status === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'verifying' || !code}
              className="w-full rounded-full bg-[#0f5d3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d4e35] disabled:bg-gray-400"
            >
              {status === 'verifying' ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-[#d97700] hover:text-[#b35f00] disabled:text-gray-400"
              >
                {isResending ? 'Resending...' : 'Resend verification code'}
              </button>
            </div>
          </form>
        )}
        {status === 'success' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-[#0f5d3f]">Email Verified!</h2>
              <p className="mt-2 text-gray-600">{message}</p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-md bg-[#0f5d3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d4e35]"
            >
              Continue to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
