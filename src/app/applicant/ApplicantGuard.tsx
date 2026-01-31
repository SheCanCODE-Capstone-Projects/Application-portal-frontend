// src/app/applicant/ApplicantGuard.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ApplicantGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, checkAuth, hasCohort } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const verify = async () => {
            await checkAuth();
            setChecking(false);
        };
        verify();
    }, [checkAuth]);

    useEffect(() => {
        if (checking) return;

        if (!isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        if (user?.role !== "APPLICANT") {
            router.push(user?.role === "ADMIN" ? "/admin" : "/");
            return;
        }


        const isOnboardingPage = pathname.startsWith("/applicant/onboarding");
        
        if (!hasCohort && !isOnboardingPage) {
            router.push("/applicant/onboarding");
            return;
        }

        if (hasCohort && isOnboardingPage) {
            router.push("/applicant/onboarding");
            return;
        }
    }, [checking, isAuthenticated, user, hasCohort, router, pathname]);


    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-500">Verifying your session...</p>
                </div>
            </div>
        );
    }


    if (!isAuthenticated || user?.role !== "APPLICANT") {
        return null;
    }


    const isOnboardingPage = pathname.startsWith("/applicant/onboarding");
    if (!hasCohort && !isOnboardingPage) {
        return null;
    }

    return <>{children}</>;
}
