import { api } from "@/lib/api/api";
import { ADMIN_ROUTES } from "./admin-controller";
import { Application, ApplicationStatus } from "@/types/application/application";

export interface DashboardStats {
    totalApplicants: number;
    activeCohorts: number;
    systemRejects: number;
    successfulRegisters: number;
    trends: {
        applicants: string;
        cohorts: string;
        rejects: string;
        registers: string;
    };
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

export const adminService = {
    getDashboardStats: async (token: string): Promise<DashboardStats> => {
        const res = await api.get(ADMIN_ROUTES.DASHBOARD_STATS, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    getAllApplications: async (token: string, params?: { status?: string; cohort?: string; search?: string }): Promise<Application[]> => {
        const res = await api.get(ADMIN_ROUTES.ALL_APPLICATIONS, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
        return res.data.data;
    },

    getApplicationById: async (token: string, id: string): Promise<Application> => {
        const url = ADMIN_ROUTES.APPLICATION_BY_ID.replace("{id}", id);
        const res = await api.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    updateApplicationStatus: async (token: string, id: string, status: ApplicationStatus): Promise<Application> => {
        const endpoint = (status === ApplicationStatus.ACCEPTED || status === ApplicationStatus.APPROVED)
            ? `/api/v1/admin/applications/${id}/accept`
            : `/api/v1/admin/applications/${id}/reject`;

        const res = await api.put(endpoint, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    getAllUsers: async (token: string): Promise<AdminUser[]> => {
        const res = await api.get(ADMIN_ROUTES.ALL_USERS, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    getSystemRejects: async (token: string): Promise<Application[]> => {
        const res = await api.get(ADMIN_ROUTES.SYSTEM_REJECTS, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },
};
