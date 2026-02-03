"use client";

import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { applicationService } from "@/services/application/application-service";
import { Application } from "@/types/application/application";

interface UseApplicationReturn {
    application: Application | null;
    loading: boolean;
    error: string | null;
    fetchMyApplication: () => Promise<Application | null>;
    startApplication: () => Promise<Application | null>;
    clearError: () => void;
}

export function useApplication(): UseApplicationReturn {
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => localStorage.getItem("access_token");

    const fetchMyApplication = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await applicationService.getMyApplication(token);
            setApplication(data);
            return data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const message = err.response?.data?.message || err.message || "Failed to fetch application";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const startApplication = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await applicationService.startApplication(token);
            setApplication(data);
            return data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const message = err.response?.data?.message || err.message || "Failed to start application";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        application,
        loading,
        error,
        fetchMyApplication,
        startApplication,
        clearError,
    };
}
