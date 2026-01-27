"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, checkAuth } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            if (!user) {
                await checkAuth();
            }
            setIsLoading(false);
        };
        verify();
    }, [user, checkAuth]);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (user?.role !== "ADMIN") {
            // If they are applicant, send them to applicant dashboard or home
            if (user?.role === "APPLICANT") {
                router.push("/applicant/dashboard");
            } else {
                router.push("/");
            }
            return;
        }
    }, [isAuthenticated, user, router, isLoading]);

    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center">Loading Admin...</div>;
    }

    if (!isAuthenticated || user?.role !== "ADMIN") {
        return null;
    }

    return <>{children}</>;
}
