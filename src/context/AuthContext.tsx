"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { AuthView, User } from "@/types/auth/AuthView";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/user/user-service";

type AuthContextType = {
    user: User | null;
    userProfile: UserProfile | null;
    view: AuthView;
    setView: (view: AuthView) => void;
    isAuthenticated: boolean;
    loginWithToken: (token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
    refreshProfile: () => Promise<UserProfile | null>;
    hasCohort: boolean;
    loading: boolean;
};

type ApplicationStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "DRAFT" | "SUBMITTED";

type DecodedToken = {
    userId: string;
    sub: string;
    role: "ADMIN" | "APPLICANT" | string;
    exp: number;
    iat: number;
    cohortId?: string;
    cohortName?: string;
    applicationStatus?: string;
    applicationStep?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [view, setView] = useState<AuthView>("login");
    const router = useRouter();
    const isAuthenticated = !!user;

    // Initial loading state must be true
    const [loading, setLoading] = useState(true);

    const decodeToken = (token: string): DecodedToken | null => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );

            const payload = JSON.parse(jsonPayload);

            if (!payload.userId || !payload.sub || !payload.role || !payload.exp || !payload.iat) {
                throw new Error("Token payload missing required fields");
            }

            return payload
        } catch (err) {
            console.error("Failed to decode token:", err);
            return null;
        }
    };

    const isTokenExpired = (exp: number): boolean => {
        return Date.now() >= (exp * 1000) - 10000;
    };

    const fetchUserProfile = useCallback(async (token: string): Promise<UserProfile | null> => {
        try {
            const profile = await userService.me(token);
            setUserProfile(profile);
            return profile;
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            return null;
        }
    }, []);

    const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
        const token = localStorage.getItem("access_token");
        if (!token) return null;
        return fetchUserProfile(token);
    }, [fetchUserProfile]);

    const logout = useCallback(() => {
        localStorage.removeItem("access_token");
        setUser(null);
        setUserProfile(null);
        router.push("/login");
    }, [router]);

    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");

            // Case 1: No token found
            if (!token) {
                setUser(null);
                setUserProfile(null);
                return; // Code will jump to 'finally' block
            }

            const payload = decodeToken(token);

            // Case 2: Invalid or expired token
            if (!payload || (payload.exp && isTokenExpired(payload.exp))) {
                logout();
                return; // Code will jump to 'finally' block
            }

            const allowedStatuses: ApplicationStatus[] = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "DRAFT", "SUBMITTED"];
            const appStatus: ApplicationStatus = allowedStatuses.includes(payload.applicationStatus as ApplicationStatus)
                ? (payload.applicationStatus as ApplicationStatus)
                : "NOT_STARTED";

            setUser({
                id: payload.userId,
                email: payload.sub,
                role: payload.role,
                name: payload.sub.split("@")[0],
                exp: payload.exp,
                iat: payload.iat,
                cohort: payload.cohortId || null,
                applicationStatus: appStatus,
                applicationStep: payload.applicationStep || "/applicant/apply"
            });

            await fetchUserProfile(token);

        } catch (err) {
            console.error("Auth check failed:", err);
            setUser(null);
            setUserProfile(null);
        } finally {
            // ✅ THIS IS THE FIX: Ensure loading always turns off
            setLoading(false);
        }
    }, [fetchUserProfile, logout]);

    const loginWithToken = useCallback(async (token: string) => {
        localStorage.setItem("access_token", token);

        const payload = decodeToken(token);
        if(!payload) return;

        const allowedStatuses: ApplicationStatus[] = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "DRAFT", "SUBMITTED"];
        const appStatus: ApplicationStatus = allowedStatuses.includes(payload.applicationStatus as ApplicationStatus)
            ? (payload.applicationStatus as ApplicationStatus)
            : "NOT_STARTED";

        if (payload) {
            setUser({
                id: payload.userId,
                email: payload.sub,
                role: payload.role,
                name: payload.sub.split("@")[0],
                exp: payload.exp,
                iat: payload.iat,
                cohort: payload.cohortId || null,
                applicationStatus: appStatus,
                applicationStep: payload.applicationStep || "/applicant/apply"
            });
        }
        await fetchUserProfile(token);
        if (payload?.role === "ADMIN") {
            router.push("/admin");
        } else if (payload?.role === "APPLICANT") {
            router.push("/applicant");
        }
    }, [fetchUserProfile, router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const hasCohort = !!(userProfile?.cohortId && userProfile?.cohortName);

    return (
        <AuthContext.Provider value={{
            user,
            userProfile,
            view,
            setView,
            isAuthenticated,
            loginWithToken,
            logout,
            checkAuth,
            refreshProfile,
            hasCohort,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};