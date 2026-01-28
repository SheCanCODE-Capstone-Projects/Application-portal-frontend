"use client";

import { useState, useCallback } from "react";
import { userService } from "@/services/user/user-service";
import { cohortService } from "@/services/cohort/cohort-service";
import { Cohort } from "@/types/cohort/cohort";

interface UseCohortApplicationReturn {
    cohorts: Cohort[];
    loading: boolean;
    applying: boolean;
    error: string | null;
    fetchCohorts: () => Promise<void>;
    applyToCohort: (cohortId: string) => Promise<boolean>;
    clearError: () => void;
}

export function useCohortApplication(): UseCohortApplicationReturn {
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => localStorage.getItem("access_token");

    const fetchCohorts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await cohortService.getCohortsForFrontend();
            setCohorts(Array.isArray(data) ? data : []);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const message = error.response?.data?.message || error.message || "Failed to fetch cohorts";
            setError(message);
            setCohorts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const applyToCohort = useCallback(async (cohortId: string): Promise<boolean> => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return false;
        }

        setApplying(true);
        setError(null);
        try {
            await userService.applyToCohort(cohortId, token);
            return true;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const message = error.response?.data?.message || error.message || "Failed to apply to cohort";
            setError(message);
            return false;
        } finally {
            setApplying(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        cohorts,
        loading,
        applying,
        error,
        fetchCohorts,
        applyToCohort,
        clearError,
    };
}
