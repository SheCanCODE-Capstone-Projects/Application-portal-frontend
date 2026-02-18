"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation"; // Import useParams
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";
import { useResendVerification } from "@/hooks/auth/useResendVerification";
import { Loader2 } from "lucide-react"; // Assuming you have this icon, consistent with your other pages
import { AuroraBackground } from "@/components/background/page";

export default function EmailVerification() {
    // 1. Get token from the URL Path (because file is in [token] folder)
    const params = useParams();
    const token = params?.token as string;

    // 2. Get email from Query String (optional, if you append ?email=...)
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get("email");

    const { status, message } = useVerifyEmail(token);
    const { resend, loading } = useResendVerification();

    const [email, setEmail] = useState(emailFromUrl || "");
    const [resent, setResent] = useState(false);

    const handleResend = async () => {
        if (!email) return;
        await resend(email);
        setResent(true);
    };

    return (
        <AuroraBackground>
        <div className="flex min-h-screen items-center justify-center px-4 py-10 w-full">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-[#d7cfc8] z-40">
                <div className="mb-6">
                    {status === "verifying" && (
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    )}

                    {status === "success" && (
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <svg
                                className="h-8 w-8 text-green-600"
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
                    )}

                    {status === "error" && (
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <svg
                                className="h-8 w-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    )}

                    <h2 className="mt-6 text-2xl font-bold text-[#0f5d3f]">
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
                            href="/login"
                            className="inline-flex w-full justify-center items-center rounded-xl border border-transparent bg-[#0f5d3f] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#0d4e35] transition-colors"
                        >
                            Continue to Login
                        </Link>
                    ) : status === "error" ? (
                        <div className="space-y-4">
                            {!resent ? (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-600 mb-3 font-medium">Link expired? Request a new one:</p>

                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0f5d3f] focus:ring-2 focus:ring-[#0f5d3f]/20 outline-none transition-all mb-3"
                                    />

                                    <button
                                        onClick={handleResend}
                                        disabled={!email || loading}
                                        className="w-full inline-flex items-center justify-center rounded-lg bg-[#0f5d3f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0d4e35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resending...
                                            </>
                                        ) : "Request Verification Again"}
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-green-700 font-medium text-sm">
                                        Verification email resent! Please check your inbox.
                                    </p>
                                </div>
                            )}

                            <div className="pt-2">
                                <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-[#0f5d3f]">
                                    Back to Login
                                </Link>
                            </div>

                            <p className="text-xs text-gray-400">
                                Need help?{" "}
                                <a
                                    href="mailto:support@shecancode.org"
                                    className="font-medium text-[#0f5d3f] hover:underline"
                                >
                                    Contact Support
                                </a>
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
        </AuroraBackground>
    );
}