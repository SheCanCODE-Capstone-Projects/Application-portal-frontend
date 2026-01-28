"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { applicationService } from "@/services/application/application-service";
import { Application, ApplicationStatus } from "@/types/application/application";

interface ApplyFlowResult {
    loading: boolean;
    error: string | null;
    handleApplyFlow: () => Promise<void>;
}

export function useApplyFlow(): ApplyFlowResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const getToken = () => localStorage.getItem("access_token");

    const determineStep = (app: Application): number => {
        if (!app.personalInfo) return 1;
        if (!app.education) return 2;
        if (!app.motivation) return 3;
        if (!app.documents || app.documents.length === 0) return 4;
        return 5;
    };

    const handleApplyFlow = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Check authentication
            if (!isAuthenticated || !user) {
                router.push("/login?redirect=/applicant/apply");
                return;
            }

            // Check role
            if (user.role === "ADMIN") {
                router.push("/admin");
                return;
            }

            const token = getToken();
            if (!token) {
                router.push("/login?redirect=/applicant/apply");
                return;
            }

            // Fetch existing application
            const existingApp = await applicationService.getMyApplication(token);

            if (existingApp) {
                // Check if already submitted
                const submittedStatuses: ApplicationStatus[] = [
                    ApplicationStatus.SUBMITTED,
                    ApplicationStatus.PENDING_REVIEW,
                    ApplicationStatus.UNDER_REVIEW,
                    ApplicationStatus.ACCEPTED,
                    ApplicationStatus.REJECTED,
                    ApplicationStatus.APPROVED,
                ];

                if (submittedStatuses.includes(existingApp.status)) {
                    // Already submitted - go to dashboard
                    router.push("/applicant/dashboard");
                } else {
                    // Application in progress - resume from current step
                    const step = determineStep(existingApp);
                    router.push(`/applicant/apply?step=${step}&id=${existingApp.id}`);
                }
            } else {
                // First time - start new application
                try {
                    const newApp = await applicationService.startApplication(token);
                    router.push(`/applicant/apply?step=1&id=${newApp.id}`);
                } catch (startErr: any) {
                    // If start fails, still go to apply page
                    router.push("/applicant/apply?step=1");
                }
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Something went wrong";
            setError(message);
            // On error, still allow user to try applying
            router.push("/applicant/apply");
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user, router]);

    return {
        loading,
        error,
        handleApplyFlow,
    };
}
