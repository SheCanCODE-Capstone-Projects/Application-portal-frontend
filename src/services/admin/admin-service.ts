import { api } from "@/lib/api/api";
import { ADMIN_ROUTES } from "./admin-controller";
import { Application, ApplicationStatus, ApplicationQueryParams } from "@/types/application/application";
import { ApiResponse } from "@/types/api";



export interface DailyTrendItem {
    date: string;
    count: number;
}

export interface DashboardTrends {
    applicants: string;
    cohorts: string;
    rejects: string;
    registers: string;
}

export interface CohortBreakdownItem {
    name: string;
    ACCEPTED: number;
    REJECTED: number;
    PENDING: number;
}

export interface DashboardCharts {
    dailyTrend: DailyTrendItem[];
    cohortBreakdown: CohortBreakdownItem[];
}

export interface DashboardStatsResponse {
    totalApplicants: number;
    activeCohorts: number;
    systemRejects: number;
    successfulRegisters: number;
    trends: DashboardTrends;
    charts?: DashboardCharts;
}

export interface UserResponseDto {
    id: string;
    username: string;
    email: string;
    status: string;
    cohortId: string | null;
    cohortName: string | null;
    createdAt: string;
}

export const adminService = {
    // --- Dashboard ---
    getDashboardStats: async (token: string): Promise<DashboardStatsResponse> => {
        const res = await api.get<ApiResponse<DashboardStatsResponse>>(ADMIN_ROUTES.DASHBOARD_STATS, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    // --- Users ---
    getAllUsers: async (token: string): Promise<UserResponseDto[]> => {
        const res = await api.get(ADMIN_ROUTES.ALL_USERS, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // FIX: Handle direct array response based on your JSON logs
        if (Array.isArray(res.data)) {
            return res.data;
        }

        return res.data.data || [];
    },

    deleteUser: async (token: string, id: string): Promise<void> => {
        const url = `/api/v1/admin/users/${id}`;
        await api.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    // --- Applications ---
    getAllApplications: async (token: string, params?: ApplicationQueryParams): Promise<Application[]> => {
        const res = await api.get(ADMIN_ROUTES.ALL_APPLICATIONS, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
        // Handle potentially different response structures for applications too
        if (Array.isArray(res.data)) return res.data;
        return res.data.data || [];
    },

    getApplicationById: async (token: string, id: string): Promise<Application> => {
        const url = ADMIN_ROUTES.APPLICATION_BY_ID.replace("{id}", id);
        const res = await api.get(url, { headers: { Authorization: `Bearer ${token}` } });
        // Handle potentially different response structures
        if (res.data && !res.data.data && res.data.id) return res.data;
        return res.data.data;
    },

    updateApplicationStatus: async (token: string, id: string, status: string): Promise<Application> => {
        const endpoint = (status === ApplicationStatus.ACCEPTED || status === ApplicationStatus.APPROVED)
            ? `/api/v1/admin/applications/${id}/accept`
            : `/api/v1/admin/applications/${id}/reject`;
        const res = await api.put(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
        return res.data.data || res.data;
    },

    scheduleInterview: async (token: string, id: string, date: string, instructions: string): Promise<Application> => {
        const url = `/api/v1/admin/applications/${id}/schedule-interview`;
        const res = await api.put(url, { interviewDate: date, instructions }, { headers: { Authorization: `Bearer ${token}` } });
        return res.data.data || res.data;
    },

    archiveApplication: async (token: string, id: string): Promise<void> => {
        const url = `/api/v1/admin/applications/${id}/archive`;
        await api.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
    }
};