import { APPLICATION_ROUTES } from "./application-controller";
import {
    Application,
    DisabilityDto, DocumentDto,
    EducationDto, EmergencyContactDto,
    MotivationDto,
    PersonalInfoDto, VulnerabilityDto
} from "@/types/application/application";
import {api} from "@/lib/api/api";


export const applicationService = {
    // Start a new application
    startApplication: async (token: string): Promise<Application> => {
        const res = await api.post(APPLICATION_ROUTES.START, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    // Get current user's application
    getMyApplication: async (token: string): Promise<Application | null> => {
        try {
            const res = await api.get(APPLICATION_ROUTES.MY_APPLICATION, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.data;
        } catch (err: any) {
            if (err.response?.status === 404) return null;
            throw err;
        }
    },

    // Save personal info
    savePersonalInfo: async (id: string, data: PersonalInfoDto, token: string): Promise<Application> => {
        const url = APPLICATION_ROUTES.PERSONAL_INFO.replace("{id}", id);
        const res = await api.put(url, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    // Save education
    saveEducation: async (id: string, data: EducationDto, token: string): Promise<Application> => {
        const url = APPLICATION_ROUTES.EDUCATION.replace("{id}", id);
        const res = await api.put(url, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    // Save motivation
    saveMotivation: async (id: string, data: MotivationDto, token: string): Promise<Application> => {
        const url = APPLICATION_ROUTES.MOTIVATION.replace("{id}", id);
        const res = await api.put(url, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    // Save disability
    saveDisability: async (id: string, data: DisabilityDto, token: string): Promise<Application> => {
        const url = APPLICATION_ROUTES.DISABILITY.replace("{id}", id);
        const res = await api.put(url, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    // Save vulnerability
    saveVulnerability: async (id: string, data: VulnerabilityDto, token: string): Promise<Application> => {
        const url = APPLICATION_ROUTES.VULNERABILITY.replace("{id}", id);
        const res = await api.put(url, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    // Save documents
    saveDocuments: async (id: string, data: DocumentDto[], token: string): Promise<Application> => {
        const url = APPLICATION_ROUTES.DOCUMENTS.replace("{id}", id);
        const res = await api.put(url, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    // Save emergency contacts
    saveEmergencyContacts: async (id: string, data: EmergencyContactDto[], token: string): Promise<Application> => {
        const url = APPLICATION_ROUTES.EMERGENCY_CONTACTS.replace("{id}", id);
        const res = await api.put(url, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    // Submit application
    submitApplication: async (id: string, token: string): Promise<Application> => {
        const url = APPLICATION_ROUTES.SUBMIT.replace("{id}", id);
        const res = await api.put(url, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    // Get application progress
    getProgress: async (id: string, token: string): Promise<number> => {
        const url = APPLICATION_ROUTES.PROGRESS.replace("{id}", id);
        const res = await api.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data.percentage;
    },
};
