"use client";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useRegisterForm } from "@/hooks/auth/form/useRegisterForm";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRegister } from "@/hooks/auth/useRegister";
import { useRouter } from "next/navigation";
import { useGoogleAuth } from "@/hooks/auth/googleAuth";

export default function RegisterForm() {
  const { register } = useRegister();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const router = useRouter();
  const { loading, sendGoogleAuth } = useGoogleAuth();
  const {
    formData,
    errors: fieldErrors,
    isLoading,
    handleChange,
    handleSubmit,
  } = useRegisterForm();

  useEffect(() => {
    if (registrationSuccess) {
      const time = setTimeout(() => {
        router.push("/login");
      }, 5000);

      return () => clearTimeout(time);
    }
  }, [registrationSuccess, router]);

  const onSubmit = async (data: typeof formData) => {
    try {
      const res = await register(data);

      toast.success(res.message || "Account created successfully");

      setRegistrationSuccess(true);

    } catch (error: unknown) {

      let message: string;

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as { message: string }).message;
      } else {
        message = "Failed to register";
      }
      toast.error(message);
    }
  };


  if (registrationSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10 w-full z-30">
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
              Registration Successful!
            </h2>
            <p className="mt-2 text-gray-600">
              Please check your email to verify your account. You&#39;ll be
              redirected to the login page shortly.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/login"
              className="text-md font-medium text-[#0f5d3f] hover:text-[#0d4e35]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 w-full z-30">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-[#d7cfc8]">
        <div className="mb-8 text-center">
          <h1 className="mt-3 text-3xl font-semibold text-[#0f5d3f]">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-[#3f3f3f]">
            Join our community today
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`block w-full text-[#0f5d3f] rounded-md border ${fieldErrors.username
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#0f5d3f] focus:ring-[#0f5d3f]"
                    } p-2 shadow-sm sm:text-sm`}
                />
                {fieldErrors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.username}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address *
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`block w-full text-[#0f5d3f] rounded-md border ${fieldErrors.email
                    ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#0f5d3f] focus:ring-[#0f5d3f]"
                  } p-2 shadow-sm sm:text-sm`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password *
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`block w-full text-[#0f5d3f] rounded-md border ${fieldErrors.password
                    ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#0f5d3f] focus:ring-[#0f5d3f]"
                  } p-2 shadow-sm sm:text-sm`}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-full border border-transparent ${isLoading
                  ? "bg-[#0f5d3f] opacity-70"
                  : "bg-[#0f5d3f] hover:bg-[#0d4e35]"
                } py-2 px-4 text-sm font-medium text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f5d3f] focus:ring-offset-2`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold text-[#d97700] hover:text-[#b35f00]"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={sendGoogleAuth}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0f5d3f] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <GoogleIcon className="h-8 w-8" />
              <span>{loading ? "Signing in..." : "Continue with Google"}</span>
            </button>

          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="mt-2 text-sm text-[#3f3f3f]">
            Create your account to get started
          </p>
        </div>
      </div>
    </div>
  );
}
