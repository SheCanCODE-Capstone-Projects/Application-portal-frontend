"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Only perform checks when the global auth check has finished
        if (!loading) {
            if (!isAuthenticated) {
                // Not logged in -> Go to login
                router.replace("/login");
            } else if (user?.role !== "ADMIN") {
                // Logged in but not an admin -> Kick them out
                router.replace(user?.role === "APPLICANT" ? "/applicant/dashboard" : "/");
            } else {
                // Logged in AND Admin -> Let them in
                // Small delay prevents flicker if the state updates very fast
                setTimeout(() => setIsAuthorized(true), 100);
            }
        }
    }, [isAuthenticated, user, loading, router]);

    // Show loading spinner if:
    // 1. AuthContext is still checking (loading === true)
    // 2. We haven't confirmed authorization yet (isAuthorized === false)
    if (loading || !isAuthorized) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return <>{children}</>;
}