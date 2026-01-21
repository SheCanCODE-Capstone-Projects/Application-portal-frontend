"use client";

import Link from "next/link";
import { toast } from "sonner";
import {useRouter, useSearchParams} from "next/navigation";
import { useState, useEffect } from "react";
import {useResetPasswordForm} from "@/hooks/userRestForm";
import {useResetPassword} from "@/hooks/useResetPasswordForm";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const router = useRouter();

  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmitNewPassword,
    setFormData,
  } = useResetPasswordForm();

  const { resetPassword } = useResetPassword();

  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);


  useEffect(() => {
    if (tokenFromUrl) {
      setFormData((prev) => ({
        ...prev,
        token: tokenFromUrl,
      }));
    }

    if (success) {
      const time = setTimeout(() => {
        router.push("/login");
      }, 5000);

      return () => clearTimeout(time);
    }
  }, [tokenFromUrl, setFormData]);

  const onSubmit = async (data: typeof formData) => {
    try {
      await resetPassword(data);
      setSuccess(true);
      toast.success("Password reset successful");
    } catch (error: unknown) {
      const message =
          error instanceof Error ? error.message : "Password reset failed";
      setFormError(message);
      toast.error(message);
    }
  };

  /* ---------------- SUCCESS SCREEN ---------------- */
  if (success) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10 w-full z-30">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-[#0f5d3f]">
              Password Reset Successful
            </h2>
            <p className="mt-2 text-gray-600">
              You can now log in using your new password.
            </p>

            <Link
                href="/login"
                className="mt-6 inline-flex rounded-md bg-[#0f5d3f] px-4 py-2 text-white hover:bg-[#0d4e35]"
            >
              Back to Login
            </Link>
          </div>
        </div>
    );
  }

  /* ---------------- INVALID TOKEN ---------------- */
  if (!tokenFromUrl) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10 z-30">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-red-600">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-gray-600">
              This password reset link is invalid or expired.
            </p>

            <Link
                href="/forgot-password"
                className="mt-6 inline-flex rounded-md bg-[#0f5d3f] px-4 py-2 text-white hover:bg-[#0d4e35]"
            >
              Request New Link
            </Link>
          </div>
        </div>
    );
  }

  /* ---------------- FORM ---------------- */
  return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10 w-full z-30">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-center text-3xl font-semibold text-[#0f5d3f]">
            Reset Your Password
          </h1>

          {formError && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </div>
          )}

          <form
              className="mt-6 space-y-6"
              onSubmit={handleSubmitNewPassword(onSubmit)}
          >
            {/* TOKEN (hidden) */}
            <input type="hidden" name="token" value={formData.token} />

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border p-2"
              />
              {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.newPassword}
                  </p>
              )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-[#0f5d3f] py-2 text-white hover:bg-[#0d4e35] disabled:opacity-70"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-[#d97700]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
  );
}
