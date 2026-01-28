"use client";

import { useState, useCallback } from "react";
import { cohortService } from "@/services/cohort/cohort-service";
import { Cohort } from "@/types/cohort/cohort";

interface UseCohortsReturn {
    cohorts: Cohort[];
    loading: boolean;
    saving: boolean;
    error: string | null;
    fetchCohorts: () => Promise<void>;
    createCohort: (data: Partial<Cohort>) => Promise<boolean>;
    updateCohort: (id: string, data: Partial<Cohort>) => Promise<boolean>;
    deleteCohort: (id: string) => Promise<boolean>;
    clearError: () => void;
}

export function useCohorts(): UseCohortsReturn {
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => localStorage.getItem("access_token");

    const fetchCohorts = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await cohortService.getAllAdminCohorts(token);
            setCohorts(Array.isArray(data) ? data : []);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to fetch cohorts";
            setError(message);
            setCohorts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createCohort = useCallback(async (data: Partial<Cohort>): Promise<boolean> => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return false;
        }

        setSaving(true);
        setError(null);
        try {
            const newCohort = await cohortService.createCohort(data, token);
            setCohorts(prev => [newCohort, ...prev]);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to create cohort";
            setError(message);
            return false;
        } finally {
            setSaving(false);
        }
    }, []);

    const updateCohort = useCallback(async (id: string, data: Partial<Cohort>): Promise<boolean> => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return false;
        }

        setSaving(true);
        setError(null);
        try {
            const updated = await cohortService.updateCohort(id, data, token);
            setCohorts(prev => prev.map(c => c.id === id ? updated : c));
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to update cohort";
            setError(message);
            return false;
        } finally {
            setSaving(false);
        }
    }, []);

    const deleteCohort = useCallback(async (id: string): Promise<boolean> => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return false;
        }

        setSaving(true);
        setError(null);
        try {
            await cohortService.deleteCohort(id, token);
            setCohorts(prev => prev.filter(c => c.id !== id));
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to delete cohort";
            setError(message);
            return false;
        } finally {
            setSaving(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        cohorts,
        loading,
        saving,
        error,
        fetchCohorts,
        createCohort,
        updateCohort,
        deleteCohort,
        clearError,
    };
}
