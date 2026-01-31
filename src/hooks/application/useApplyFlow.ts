// src/hooks/application/useApplyFlow.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { applicationService } from "@/services/application/application-service";
import { ApplicationStatus } from "@/types/application/application";
import { toast } from "sonner";

export function useApplyFlow() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const handleApplyFlow = useCallback(async () => {
        setLoading(true);
        try {
            if (!isAuthenticated) {
                router.push("/login?redirect=/applicant/apply");
                return;
            }

            const token = localStorage.getItem("access_token");
            if (!token) return;

            // 1. Check if user already has an application
            const existingApp = await applicationService.getMyApplication(token);

            if (existingApp) {
                // 2. "Apply Once" Logic: If already submitted or processed, go to dashboard
                const completedStatuses = [
                    ApplicationStatus.SUBMITTED,
                    ApplicationStatus.UNDER_REVIEW,
                    ApplicationStatus.ACCEPTED,
                    ApplicationStatus.REJECTED,
                    ApplicationStatus.APPROVED
                ];

                if (completedStatuses.includes(existingApp.status)) {
                    toast.info("You have already submitted an application.");
                    router.push("/applicant/dashboard");
                } else {
                    // 3. If it's a DRAFT, resume from the current step
                    router.push(`/applicant/apply?step=1&id=${existingApp.id}`);
                }
            } else {
                // 4. No application found? Start one.
                const newApp = await applicationService.startApplication(token);
                router.push(`/applicant/apply?step=1&id=${newApp.id}`);
            }
        } catch (err: any) {
            toast.error("Failed to process application flow");
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, router]);

    return { loading, handleApplyFlow };
}