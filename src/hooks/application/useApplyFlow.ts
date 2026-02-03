 import { useState, useCallback } from "react";
    import { useRouter } from "next/navigation";
    import { useAuth } from "@/context/AuthContext";

    export function useApplyFlow() {
        const [loading, setLoading] = useState(false);
        const router = useRouter();
        const { user, isAuthenticated } = useAuth();

        const handleApplyFlow = useCallback(async () => {
            setLoading(true);
            try {
                if (!isAuthenticated) {
                    // Not logged in -> Go to login, then return to applicant authenticator
                    router.push("/login?redirect=/applicant");
                    return;
                }

                // Role-based redirection
                if (user?.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    // Applicant -> Go to Authenticator to handle checks/auto-start
                    router.push("/applicant");
                }

            } catch (err) {
                console.error("Apply flow error", err);
            } finally {
                // Add slight delay to prevent UI flicker during route change
                setTimeout(() => setLoading(false), 1000);
            }
        }, [isAuthenticated, user, router]);

        return { loading, handleApplyFlow };
    }