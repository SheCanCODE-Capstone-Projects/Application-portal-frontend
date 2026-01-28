"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useApplyFlow } from "@/hooks/application/useApplyFlow";
import { Loader2 } from "lucide-react";

interface ApplyNowButtonProps {
    className?: string;
    onNeedAuth?: () => void;
    children?: React.ReactNode;
}

export function ApplyNowButton({ className, onNeedAuth, children }: ApplyNowButtonProps) {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuth();
    const { loading: applyLoading, handleApplyFlow } = useApplyFlow();
    const [checking, setChecking] = useState(false);

    const handleClick = async () => {
        setChecking(true);
        
        try {
            // First check if user is authenticated
            await checkAuth();
            
            // Small delay to ensure state is updated
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (err) {
            console.error("Error checking auth:", err);
        } finally {
            setChecking(false);
        }
    };

    // Handle navigation after auth check
    useEffect(() => {
        const handleNavigation = async () => {
            if (!checking && isAuthenticated && user) {
                // User is authenticated - proceed with apply flow
                await handleApplyFlow();
            } else if (!checking && !isAuthenticated) {
                // Not authenticated - show auth modal or redirect
                if (onNeedAuth) {
                    onNeedAuth();
                } else {
                    router.push("/login?redirect=/applicant/apply");
                }
            }
        };

        // Only run after initial check
        if (!checking) {
            // Skip on initial mount
            const hasChecked = localStorage.getItem("apply_check");
            if (hasChecked === "true") {
                handleNavigation();
                localStorage.removeItem("apply_check");
            }
        }
    }, [checking, isAuthenticated, user, handleApplyFlow, onNeedAuth, router]);

    const handleButtonClick = async () => {
        localStorage.setItem("apply_check", "true");
        await handleClick();
    };

    const isLoading = checking || applyLoading;

    return (
        <button
            onClick={handleButtonClick}
            disabled={isLoading}
            className={className || "rounded-full bg-[#2f573d] px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-semibold text-white shadow-lg hover:scale-105 transition-all duration-200 min-w-[160px] disabled:opacity-70 disabled:cursor-not-allowed"}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Checking...</span>
                </span>
            ) : (
                children || "Apply Now"
            )}
        </button>
    );
}
