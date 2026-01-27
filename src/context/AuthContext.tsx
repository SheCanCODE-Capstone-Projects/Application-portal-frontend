"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types/auth/AuthView";
import { useRouter } from "next/navigation";

type AuthContextType = {
    user: User | null;
    role: string | null;
    isAuthenticated: boolean;
    setToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [view, setView] = useState<AuthView>("login");
    const router = useRouter();
    const isAuthenticated = !!user;
    // Remove the previous 'role' const as it wasn't part of the context value type in the previous file, 
    // or if it was, it's better to access it via user?.role if needed, but the plan didn't strictly ask to remove it from the exports if it was there.
    // However, looking at the previous AuthContextType definition in the *read* file (Step 26), it DID have 'role'. 
    // BUT the *new* AuthContextType in AuthView.ts (Step 61/67) DOES NOT have 'role'. 
    // So I will remove it from the Provider value to match the type.

    const decodeToken = (token: string) => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload;
        } catch (err) {
            console.error("Failed to decode token", err);
            return null;
        }
    };

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }

        try {
            // In a real app, we would verify the token with the backend here.
            // For now, we decode it and mock the user state or fetch "user".
            // If we have a user endpoint, we should use it.
            // The plan mentioned "Add checkAuth to validate token and fetch fresh user details".

            // Re-using the logic from setToken/loginWithToken for consistency, 
            // but we might want to fetch from the API if possible.
            // Given "don't mind the API" and "mock these fields", I will decode and hydrate.
            const payload = decodeToken(token);
            if (payload) {
                // Mocking extended fields based on role/randomness or just basic hydration
                // In a real scenario, this comes from the 'user' endpoint.
                // Let's assume the token has some, or we fetch from 'user'.
                // For the purpose of this task (Logic), I will try to fetch 'user' if available, otherwise hydrate from token.

                setUser({
                    id: payload.userId,
                    email: payload.sub,
                    role: payload.role,
                    name: payload.sub.split("@")[0],
                    // Mocks for logic testing - these should ideally come from backend
                    cohort: payload.cohort || null,
                    applicationStatus: payload.applicationStatus || "NOT_STARTED",
                    applicationStep: payload.applicationStep || "/applicant/apply/personal-details"
                });
            }

        } catch (error) {
            console.error("Auth check failed", error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    };

    const loginWithToken = (token: string) => {
        localStorage.setItem("token", token);
        const payload = decodeToken(token);

        if (!payload) {
            setUser(null);
            return;
        }

        const currentUser: User = {
            id: payload.userId,
            email: payload.sub,
            role: payload.role,
            name: payload.sub.split("@")[0],
            // Mocks
            cohort: payload.cohort || null,
            applicationStatus: payload.applicationStatus || "NOT_STARTED",
            applicationStep: payload.applicationStep || "/applicant/apply/personal-details"
        };

        setUser(currentUser);

        // Navigation Logic
        if (payload.role === "ADMIN") {
            router.push("/admin/dashboard");
        } else if (payload.role === "APPLICANT") {
            // The Guard will handle the fine-grained routing, but we can also push to a safe entry point.
            // pushing to /applicant/dashboard or /applicant will trigger the guard.
            router.push("/applicant/dashboard");
        }
    };

    // Initial Auth Check
    React.useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, view, setView, isAuthenticated, loginWithToken, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
