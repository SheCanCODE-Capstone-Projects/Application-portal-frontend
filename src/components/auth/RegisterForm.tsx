"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {GoogleIcon} from "@/components/icons/GoogleIcon";
import { emailAuthApi } from "@/api/auth/email";
import { googleAuthApi } from "@/api/auth/google";
import { getErrorMessage } from "@/utils/errors";
import { useRouter } from "next/navigation";

type FieldErrors = {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
};


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordMinLength = 8;

const hasNumber = (value: string) => /\d/.test(value);
const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasLowercase = (value: string) => /[a-z]/.test(value);
const hasSpecialChar = (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value);

export default function RegisterForm() {
  const router = useRouter();
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('register');
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    const { email, username, password, confirmPassword } = formData;

    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!username.trim()) {
      errors.username = "Username is required";
    }

    if (!password) {
      errors.password = "Password is required";
    } else {
      if (password.length < passwordMinLength) {
        errors.password = `Password must be at least ${passwordMinLength} characters long`;
      }
      if (!hasNumber(password)) {
        errors.password = "Password must contain at least one number";
      }
      if (!hasUppercase(password)) {
        errors.password = "Password must contain at least one uppercase letter";
      }
      if (!hasLowercase(password)) {
        errors.password = "Password must contain at least one lowercase letter";
      }
      if (!hasSpecialChar(password)) {
        errors.password = "Password must contain at least one special character";
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user types
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      await emailAuthApi.register(registrationData);

      setRegistrationSuccess(true);

      setTimeout(() => {
        router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
      }, 2000);

    } catch (error: unknown) {
      setFormError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
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
              href="/auth/login"
              className="text-sm font-medium text-[#0f5d3f] hover:text-[#0d4e35]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center  px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-[#d7cfc8]">
        <div className="mb-8 text-center">
          <h1 className="mt-3 text-3xl font-semibold text-[#0f5d3f]">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-[#3f3f3f]">
            Join our community today
          </p>
        </div>

        {formError && (
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
                <h3 className="text-sm font-medium text-red-800">{formError}</h3>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username *
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full text-[#0f5d3f] rounded-md border ${
                    fieldErrors.username
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
                className={`block w-full text-[#0f5d3f] rounded-md border ${
                  fieldErrors.email
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
                className={`block w-full text-[#0f5d3f] rounded-md border ${
                  fieldErrors.password
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
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password *
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full text-[#0f5d3f] rounded-md border ${
                  fieldErrors.confirmPassword
                    ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#0f5d3f] focus:ring-[#0f5d3f]"
                } p-2 shadow-sm sm:text-sm`}
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full justify-center rounded-full border border-transparent ${
                isSubmitting
                  ? "bg-[#0f5d3f] opacity-70"
                  : "bg-[#0f5d3f] hover:bg-[#0d4e35]"
              } py-2 px-4 text-sm font-medium text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f5d3f] focus:ring-offset-2`}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                  type="button"
                onClick={() => router.push('/auth/login')}
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
              onClick={() => googleAuthApi.signup()}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0f5d3f] focus:ring-offset-2"
            >
              <GoogleIcon className="h-8 w-8" />
              <span>Continue with Google</span>
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
