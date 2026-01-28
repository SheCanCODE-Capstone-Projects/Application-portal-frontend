import {Cohort} from "@/types/cohort/cohort";
import {COHORT_ROUTES} from "@/services/cohort/cohort-controller";
import {api} from "@/lib/api/api";


export const cohortService = {
    getAllAdminCohorts: async (token: string): Promise<Cohort[]> => {
        const res = await api.get<Cohort[]>(COHORT_ROUTES.ADMIN_COHORTS_GET_ALL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    createCohort: async (data: Partial<Cohort>, token: string): Promise<Cohort> => {
        const res = await api.post<Cohort>(COHORT_ROUTES.ADMIN_COHORTS_CREATE, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    updateCohort: async (id: string, data: Partial<Cohort>, token: string): Promise<Cohort> => {
        const res = await api.put<Cohort>(COHORT_ROUTES.ADMIN_COHORTS_UPDATE.replace("{id}", id), data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    deleteCohort: async (id: string, token: string): Promise<void> => {
        await api.delete(COHORT_ROUTES.ADMIN_COHORTS_DELETE.replace("{id}", id), {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    getCohortsForFrontend: async (): Promise<Cohort[]> => {
        const res = await api.get<Cohort[]>(COHORT_ROUTES.COHORTS_FRONTEND);
        return res.data;
    },

    getCohortById: async (id: string): Promise<Cohort> => {
        const res = await api.get<Cohort>(COHORT_ROUTES.COHORT_BY_ID.replace("{id}", id));
        return res.data;
    },
};
