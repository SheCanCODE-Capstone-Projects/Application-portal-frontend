"use client";

import { useState, useCallback, useEffect } from "react";
import { applicationService } from "@/services/application/application-service";
import { Application, ApplicationStatus } from "@/types/application/application";

interface ApplicationStatusResult {
    hasApplied: boolean;
    application: Application | null;
    currentStep: number;
    isFirstTime: boolean;
    loading: boolean;
    error: string | null;
    checkStatus: () => Promise<void>;
}

export function useApplicationStatus(): ApplicationStatusResult {
    const [hasApplied, setHasApplied] = useState(false);
    const [application, setApplication] = useState<Application | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => localStorage.getItem("access_token");

    const determineStep = (app: Application): number => {
        if (!app.personalInfo) return 1;
        if (!app.education) return 2;
        if (!app.motivation) return 3;
        if (!app.documents || app.documents.length === 0) return 4;
        return 5; // Review step
    };

    const checkStatus = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const app = await applicationService.getMyApplication(token);
            
            if (app) {
                setHasApplied(true);
                setApplication(app);
                setIsFirstTime(false);
                setCurrentStep(determineStep(app));
            } else {
                setHasApplied(false);
                setApplication(null);
                setIsFirstTime(true);
                setCurrentStep(1);
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setHasApplied(false);
                setIsFirstTime(true);
            } else {
                const message = err.response?.data?.message || err.message || "Failed to check application status";
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        hasApplied,
        application,
        currentStep,
        isFirstTime,
        loading,
        error,
        checkStatus,
    };
}
