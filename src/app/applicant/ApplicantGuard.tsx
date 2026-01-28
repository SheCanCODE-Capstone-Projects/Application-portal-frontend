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

        // Not authenticated - redirect to login
        if (!isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        // Wrong role - redirect appropriately
        if (user?.role !== "APPLICANT") {
            router.push(user?.role === "ADMIN" ? "/admin" : "/");
            return;
        }

        // Check if user needs onboarding (no cohort)
        const isOnboardingPage = pathname.startsWith("/applicant/onboarding");
        
        if (!hasCohort && !isOnboardingPage) {
            // User has no cohort and is not on onboarding page
            router.push("/applicant/onboarding");
            return;
        }

        if (hasCohort && isOnboardingPage) {
            // User has cohort but is on onboarding page - redirect to apply
            router.push("/applicant/apply");
            return;
        }
    }, [checking, isAuthenticated, user, hasCohort, router, pathname]);

    // Show loading while checking
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

    // Not authenticated or wrong role - show nothing while redirecting
    if (!isAuthenticated || user?.role !== "APPLICANT") {
        return null;
    }

    // On non-onboarding page without cohort - show nothing while redirecting
    const isOnboardingPage = pathname.startsWith("/applicant/onboarding");
    if (!hasCohort && !isOnboardingPage) {
        return null;
    }

    return <>{children}</>;
}
