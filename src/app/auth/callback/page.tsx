"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { AuroraBackground } from "@/components/background/page";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        const handleCallback = async () => {
            if (token) {
                try {
                    await loginWithToken(token);

                } catch (err: unknown) {

                    console.error("Google login processing failed:", err);
                    router.push("/login?error=auth_failed");
                }
            } else if (error) {

                router.push(`/login?error=${error}`);
            } else {

                router.push("/login");
            }
        };

        handleCallback();
    }, [searchParams, loginWithToken, router]);

    return (
        <AuroraBackground>
        <div className="min-h-screen flex flex-col items-center justify-center z-30">
            <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-[#0f5d3f]" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800">Authenticating</h3>
                    <p className="text-gray-500 text-sm">Verifying your Google credentials...</p>
                </div>
            </div>
        </div>
        </AuroraBackground>
    );
}

export default function CallbackPage() {
    return (
        <AuroraBackground>
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center z-30">
                <Loader2 className="h-10 w-10 animate-spin text-[#0f5d3f]" />
            </div>
        }>
            <CallbackContent />
        </Suspense>
        </AuroraBackground>
    );
}