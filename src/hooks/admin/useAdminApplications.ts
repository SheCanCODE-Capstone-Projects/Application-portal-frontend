"use client";

import { useState, useCallback } from "react";
import { adminService } from "@/services/admin/admin-service";
import {Application, ApplicationStatus} from "@/types/application/application";

interface UseAdminApplicationsReturn {
    applications: Application[];
    loading: boolean;
    error: string | null;
    fetchApplications: () => Promise<void>;
    updateStatus: (id: string, status: ApplicationStatus) => Promise<void>;
    clearError: () => void;
}

export function useAdminApplications(): UseAdminApplicationsReturn {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchApplications = useCallback(async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        setLoading(true);
        try {
            const data = await adminService.getAllApplications(token);
            setApplications(data || []);
        } catch (err: unknown) {
            console.error("Error fetching applications:", err);
            const message = err instanceof Error ? err.message : "Failed to load applications";
            setError(message || "Failed to load applications");
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStatus = useCallback(async (id: string, status: ApplicationStatus) => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        setLoading(true);
        try {
            await adminService.updateApplicationStatus(id, status, token);

            await fetchApplications();
        } catch (err: unknown) {
            console.error("Error updating application status:", err);
            const message = err instanceof Error ? err.message : "Failed to update status";
            setError(message || "Failed to update status");
        } finally {
            setLoading(false);
        }
    }, [fetchApplications]);

    const clearError = useCallback(() => setError(null), []);

    return { applications, loading, error, fetchApplications, updateStatus, clearError };
}