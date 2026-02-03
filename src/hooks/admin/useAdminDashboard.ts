"use client";

import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { adminService, DashboardStatsResponse } from "@/services/admin/admin-service";

interface UseAdminDashboardReturn {
    stats: DashboardStatsResponse | null;
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
}

const defaultStats: DashboardStatsResponse = {
    totalApplicants: 0,
    activeCohorts: 0,
    systemRejects: 0,
    successfulRegisters: 0,
    trends: {
        applicants: "0%",
        cohorts: "0",
        rejects: "0%",
        registers: "0%",
    },
};

export function useAdminDashboard(): UseAdminDashboardReturn {
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => localStorage.getItem("access_token");

    const fetchStats = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await adminService.getDashboardStats(token);
            setStats(data);
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const message = err.response?.data?.message || err.message || "Failed to fetch dashboard stats";
            setError(message);
            setStats(defaultStats);
        } finally {
            setLoading(false);
        }
    }, []);

    return { stats, loading, error, fetchStats };
}
