// src/app/admin/AdminGuard.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (user?.role !== "ADMIN") {
            router.push(user?.role === "APPLICANT" ? "/applicant/dashboard" : "/");
            return;
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || user?.role !== "ADMIN") return null;

    return <>{children}</>;
}