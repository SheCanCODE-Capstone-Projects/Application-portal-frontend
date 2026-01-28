"use client";

import { useState, useCallback } from "react";
import { adminService } from "@/services/admin/admin-service";
import { Application, ApplicationStatus } from "@/types/application/application";

interface UseAdminApplicationsReturn {
    applications: Application[];
    selectedApplication: Application | null;
    loading: boolean;
    error: string | null;
    fetchApplications: (params?: { status?: string; cohort?: string; search?: string }) => Promise<void>;
    fetchApplicationById: (id: string) => Promise<void>;
    updateStatus: (id: string, status: ApplicationStatus) => Promise<boolean>;
    clearError: () => void;
}

export function useAdminApplications(): UseAdminApplicationsReturn {
    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => localStorage.getItem("access_token");

    const fetchApplications = useCallback(async (params?: { status?: string; cohort?: string; search?: string }) => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await adminService.getAllApplications(token, params);
            setApplications(data);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to fetch applications";
            setError(message);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchApplicationById = useCallback(async (id: string) => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await adminService.getApplicationById(token, id);
            setSelectedApplication(data);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to fetch application";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStatus = useCallback(async (id: string, status: ApplicationStatus): Promise<boolean> => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            const updated = await adminService.updateApplicationStatus(token, id, status);
            setApplications(prev => prev.map(app => app.id === id ? updated : app));
            if (selectedApplication?.id === id) {
                setSelectedApplication(updated);
            }
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to update status";
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedApplication]);

    const clearError = useCallback(() => setError(null), []);

    return {
        applications,
        selectedApplication,
        loading,
        error,
        fetchApplications,
        fetchApplicationById,
        updateStatus,
        clearError,
    };
}
