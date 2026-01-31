"use client";

import { useState, useCallback } from "react";
import { adminService } from "@/services/admin/admin-service";
import { Application } from "@/types/application/application";

interface UseAdminApplicationsReturn {
    applications: Application[];
    loading: boolean;
    error: string | null;
    fetchApplications: () => Promise<void>;
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
            // Fetch all applications (backend defaults to sorting by newest)
            const data = await adminService.getAllApplications(token);
            setApplications(data || []);
        } catch (err: any) {
            console.error("Error fetching applications:", err);
            setError(err.message || "Failed to load applications");
        } finally {
            setLoading(false);
        }
    }, []);

    return { applications, loading, error, fetchApplications };
}