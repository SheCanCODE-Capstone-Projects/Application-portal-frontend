"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (token) {

            loginWithToken(token)
                .catch((err) => {
                    console.error("Google login processing failed:", err);
                    router.push("/login?error=auth_failed");
                });
        } else if (error) {
            // Handle errors returned from backend (e.g. access_denied)
            router.push(`/login?error=${error}`);
        } else {
            // Fallback if accessed without parameters
            router.push("/login");
        }
    }, [searchParams, loginWithToken, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-[#0f5d3f]" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800">Authenticating</h3>
                    <p className="text-gray-500 text-sm">Verifying your Google credentials...</p>
                </div>
            </div>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-[#0f5d3f]" />
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}