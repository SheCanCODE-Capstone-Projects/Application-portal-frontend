"use client";

import { useState, useCallback } from "react";
import { userService, UserProfile } from "@/services/user/user-service";

interface UseUserProfileReturn {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    fetchProfile: () => Promise<UserProfile | null>;
    hasCohort: boolean;
    clearError: () => void;
}

export function useUserProfile(): UseUserProfileReturn {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => localStorage.getItem("access_token");

    const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await userService.me(token);
            setProfile(data);
            return data;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const message = error.response?.data?.message || error.message || "Failed to fetch profile";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        profile,
        loading,
        error,
        fetchProfile,
        hasCohort: !!(profile?.cohortId && profile?.cohortName),
        clearError,
    };
}
