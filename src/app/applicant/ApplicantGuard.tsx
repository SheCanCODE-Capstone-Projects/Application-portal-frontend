"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplicantGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, checkAuth } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            if (!user) {
                await checkAuth();
            }
            setIsLoading(false);
        };
        verify();
    }, [user, checkAuth]);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (user?.role !== "APPLICANT") {
            // unauthorized for this section, maybe redirect to home or admin if admin
            if (user?.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else {
                router.push("/");
            }
            return;
        }

        // Logic Check 1: Has Cohort?
        // If NO cohort, they must go to application portal to select one/apply.
        // Assuming /applicant/apply is the route for applying.
        // If they are already ON the apply page, don't redirect (loop prevention).
        if (!user.cohort && !pathname.startsWith("/applicant/apply")) {
            router.push("/applicant/apply");
            return;
        }

        // Logic Check 2: Application Status
        if (user.cohort) {
            // If they HAVE a cohort, check status.

            if (user.applicationStatus === "IN_PROGRESS") {
                // Resume Logic: Redirect to saved step.
                // Prevent loop if already on the correct step.
                const targetStep = user.applicationStep || "/applicant/apply";
                if (pathname !== targetStep && !pathname.includes(targetStep)) {
                    // Simple check, might need better matching if steps have params
                    router.push(targetStep);
                }
                // If they are on the correct step, let them be.
                // However, if they are trying to go to Dashboard but are In Progress, should we force them back?
                // The prompt says "if I didn't complete application... then you will resume there".
                // So yes, force them to resume unless they are explicitly navigating within the application flow.
                if (!pathname.startsWith("/applicant/apply")) {
                    router.push(targetStep);
                }

            } else if (user.applicationStatus === "COMPLETED") {
                // If Completed, they should go to Dashboard.
                // If they are trying to go to apply, maybe redirect to dashboard?
                if (pathname.startsWith("/applicant/apply")) {
                    router.push("/applicant/dashboard");
                }
                // Otherwise render children (Dashboard or whatever sub-route they asked for in valid applicant area)
            }
        }

    }, [isAuthenticated, user, router, pathname, isLoading]);

    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
    }

    // While checking/redirecting, we might want to show nothing or a loader.
    // If we passed all checks, render children.
    // Ideally we only render children if we are at the "right" place.
    // But since this Wrapper matches /applicant/*, we need to be careful.

    // Simplification for rendering:
    // If authenticated and applicant, and we haven't redirected yet, render.
    // The useEffect handles the redirects.

    if (!isAuthenticated || user?.role !== "APPLICANT") {
        return null;
    }

    return <>{children}</>;
}
