"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCohortApplication } from "@/hooks/me/useCohortApplication";
import { Cohort } from "@/types/cohort/cohort";
import { 
    Loader2, 
    GraduationCap, 
    Calendar, 
    Users, 
    ArrowRight, 
    AlertCircle,
    CheckCircle,
    RefreshCw 
} from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const { user, isAuthenticated, hasCohort, checkAuth, refreshProfile } = useAuth();
    const { cohorts, loading, applying, error, fetchCohorts, applyToCohort, clearError } = useCohortApplication();
    
    const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [initialized, setInitialized] = useState(false);


    useEffect(() => {
        const init = async () => {
            await checkAuth();
            setInitialized(true);
        };
        init();
    }, [checkAuth]);


    useEffect(() => {
        if (initialized && !isAuthenticated) {
            router.push("/login?redirect=/applicant/onboarding");
        }
    }, [initialized, isAuthenticated, router]);

    // Redirect if admin
    useEffect(() => {
        if (initialized && user?.role === "ADMIN") {
            router.push("/admin");
        }
    }, [initialized, user, router]);

    // Redirect if already has cohort
    useEffect(() => {
        if (initialized && hasCohort) {
            router.push("/applicant/apply");
        }
    }, [initialized, hasCohort, router]);

    // Fetch cohorts
    useEffect(() => {
        if (initialized && isAuthenticated && !hasCohort) {
            fetchCohorts();
        }
    }, [initialized, isAuthenticated, hasCohort, fetchCohorts]);

    const handleApply = async () => {
        if (!selectedCohort) return;

        clearError();
        const result = await applyToCohort(selectedCohort);
        
        if (result) {
            setSuccess(true);
            // Refresh profile to get updated cohort info
            await refreshProfile();
            // Navigate to application page after short delay
            setTimeout(() => {
                router.push("/applicant/apply");
            }, 1500);
        }
    };

    // Loading state
    if (!initialized || (loading && cohorts.length === 0)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading available programs...</p>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Enrolled!</h2>
                    <p className="text-gray-600 mb-4">
                        You&apos;ve been enrolled in the program. Redirecting to your application...
                    </p>
                    <Loader2 className="w-6 h-6 animate-spin text-green-600 mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Welcome to Igire Rwanda!
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choose a program to begin your application journey. Select the cohort that best fits your schedule.
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 flex-1">{error}</p>
                        <button 
                            onClick={clearError}
                            className="text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Cohorts Grid */}
                {cohorts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {cohorts.map((cohort) => (
                            <CohortCard
                                key={cohort.id}
                                cohort={cohort}
                                selected={selectedCohort === cohort.id}
                                onSelect={() => setSelectedCohort(cohort.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Programs Available</h3>
                        <p className="text-gray-600 mb-4">
                            There are no open programs at the moment. Please check back later.
                        </p>
                        <button
                            onClick={fetchCohorts}
                            className="inline-flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                )}

                {/* Apply Button */}
                {cohorts.length > 0 && (
                    <div className="flex justify-center">
                        <button
                            onClick={handleApply}
                            disabled={!selectedCohort || applying}
                            className="px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2"
                        >
                            {applying ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Enrolling...
                                </>
                            ) : (
                                <>
                                    Continue to Application
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CohortCardProps {
    cohort: Cohort;
    selected: boolean;
    onSelect: () => void;
}

function CohortCard({ cohort, selected, onSelect }: CohortCardProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "TBD";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div
            onClick={onSelect}
            className={`bg-white rounded-2xl shadow-sm p-6 cursor-pointer transition-all border-2 ${
                selected 
                    ? "border-green-500 ring-2 ring-green-200" 
                    : "border-transparent hover:border-green-200"
            }`}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{cohort.name}</h3>
                    <p className="text-gray-500 text-sm">{cohort.description || "SheCanCODE Bootcamp"}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selected ? "border-green-500 bg-green-500" : "border-gray-300"
                }`}>
                    {selected && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                        <p className="text-sm font-medium">Application Deadline</p>
                        <p className="text-sm">{formatDate(cohort.endDate)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                        <p className="text-sm font-medium">Program Start</p>
                        <p className="text-sm">{formatDate(cohort.startDate)}</p>
                    </div>
                </div>
            </div>

            {cohort.status === "OPEN" && (
                <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Open for Applications
                    </span>
                </div>
            )}
        </div>
    );
}
