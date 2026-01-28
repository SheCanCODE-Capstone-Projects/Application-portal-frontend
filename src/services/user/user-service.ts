import { USER_ROUTES } from "./user-controller";
import { api } from "@/lib/api/api";

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    cohortId: string | null;
    cohortName: string | null;
    createdAt: string;
}

export const userService = {
    me: async (token: string): Promise<UserProfile> => {
        const res = await api.get(USER_ROUTES.ME, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data || res.data;
    },

    applyToCohort: async (cohortId: string, token: string): Promise<{ message: string }> => {
        const res = await api.post(
            USER_ROUTES.APPLY_COHORT.replace("{cohortId}", cohortId),
            null,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },

    getAllUsers: async (token: string) => {
        const res = await api.get(USER_ROUTES.GET_ALL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data || res.data;
    },

    deleteUser: async (id: string, token: string) => {
        const url = USER_ROUTES.DELETE.replace("{id}", id);
        const res = await api.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    archiveUser: async (id: string, token: string) => {
        const url = USER_ROUTES.ARCHIVE.replace("{id}", id);
        const res = await api.patch(url, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};
