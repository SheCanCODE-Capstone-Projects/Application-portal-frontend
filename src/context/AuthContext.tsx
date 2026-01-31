// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { AuthView, User } from "@/types/auth/AuthView";
import { useRouter, usePathname } from "next/navigation";
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [view, setView] = useState<AuthView>("login");
    const router = useRouter();
    const pathname = usePathname();
    const isAuthenticated = !!user;

    const decodeToken = (token: string): any => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (err) {
            return null;
        }
    };

    const isTokenExpired = (exp: number): boolean => {
        // Buffer of 10 seconds to prevent edge-case failures
        return Date.now() >= (exp * 1000) - 10000;
    };

    // Fetch user profile from API
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

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setUser(null);
            setUserProfile(null);
            return;
        }

        const payload = decodeToken(token);

        if (!payload || (payload.exp && isTokenExpired(payload.exp))) {
            console.warn("Token expired or invalid session.");
            logout();
            return;
        }

        // Hydrate User State from JWT Payload
        setUser({
            id: payload.userId,
            email: payload.sub,
            role: payload.role,
            name: payload.sub.split("@")[0],
            exp: payload.exp,
            iat: payload.iat,
            cohort: payload.cohort || null,
            applicationStatus: payload.applicationStatus || "NOT_STARTED",
            applicationStep: payload.applicationStep || "/applicant/apply"
        });

        await fetchUserProfile(token);
    }, [fetchUserProfile]);

    const logout = useCallback(() => {
        localStorage.removeItem("access_token");
        setUser(null);
        setUserProfile(null);
        router.push("/login");
    }, [router]);

    const loginWithToken = useCallback(async (token: string) => {
        localStorage.setItem("access_token", token);
        
        // Decode token first
        const payload = decodeToken(token);
        if (payload) {
            setUser({
                id: payload.userId,
                email: payload.sub,
                role: payload.role,
                name: payload.sub.split("@")[0],
                exp: payload.exp,
                iat: payload.iat,
                cohort: payload.cohort || null,
                applicationStatus: payload.applicationStatus || "NOT_STARTED",
                applicationStep: payload.applicationStep || "/applicant/apply"
            });
        }

        // Fetch profile from API
        const profile = await fetchUserProfile(token);

        // Navigate based on role and cohort status
        if (payload?.role === "ADMIN") {
            router.push("/admin");
        } else if (payload?.role === "APPLICANT") {
            // Check if user has a cohort
            if (profile && profile.cohortId && profile.cohortName) {
                // User has cohort - go to application flow
                router.push("/applicant/apply");
            } else {
                // No cohort - go to onboarding
                router.push("/applicant/onboarding");
            }
        }
    }, [fetchUserProfile, router]);

    // Check auth on mount
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
            hasCohort 
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
