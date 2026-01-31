"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { applicationService } from "@/services/application/application-service";
import { Application, ApplicationStatus } from "@/types/application/application";
import { Loader2, CheckCircle, AlertCircle, GraduationCap, ArrowRight, RefreshCw } from "lucide-react";
import {toast} from "sonner";

type CheckStatus = "checking" | "no-cohort" | "no-application" | "has-application" | "submitted" | "error";

export default function ApplicantAuthenticator() {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth, hasCohort, userProfile, refreshProfile } = useAuth();
    
    const [status, setStatus] = useState<CheckStatus>("checking");
    const [application, setApplication] = useState<Application | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const steps = [
        { label: "Verifying session", done: progress >= 25 },
        { label: "Checking enrollment", done: progress >= 50 },
        { label: "Loading application", done: progress >= 75 },
        { label: "Preparing dashboard", done: progress >= 100 },
    ];

    useEffect(() => {
        const runChecks = async () => {
            try {
                // Step 1: Check authentication
                setProgress(10);
                await checkAuth();
                
                if (!isAuthenticated) {
                    router.push("/login?redirect=/applicant");
                    return;
                }

                if (user?.role === "ADMIN") {
                    router.push("/admin");
                    return;
                }

                setProgress(25);

                // Step 2: Refresh profile to get latest cohort info
                const profile = await refreshProfile();
                setProgress(50);

                // Step 3: Check if user has cohort
                if (!profile?.cohortId || !profile?.cohortName) {
                    setStatus("no-cohort");
                    return;
                }

                // Step 4: Check application status
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("Session expired");
                    setStatus("error");
                    return;
                }

                setProgress(75);
                const app = await applicationService.getMyApplication(token);
                
                if (!app) {
                    setStatus("no-application");
                    setProgress(100);
                    return;
                }

                setApplication(app);
                setProgress(100);

                // Check if submitted
                const submittedStatuses: ApplicationStatus[] = [
                    ApplicationStatus.SUBMITTED,
                    ApplicationStatus.PENDING_REVIEW,
                    ApplicationStatus.UNDER_REVIEW,
                    ApplicationStatus.ACCEPTED,
                    ApplicationStatus.REJECTED,
                    ApplicationStatus.APPROVED,
                ];

                if (submittedStatuses.includes(app.status)) {
                    setStatus("submitted");
                    // Redirect to dashboard after brief delay
                    setTimeout(() => router.push("/applicant/dashboard"), 1500);
                } else {
                    setStatus("has-application");

                    const step = determineStep(app);
                    setTimeout(() => router.push(`/applicant/apply?step=${step}&id=${app.id}`), 1500);
                }

            } catch (err: any) {
                console.error("Authentication check failed:", err);
                setError(err.response?.data?.message || err.message || "Something went wrong");
                setStatus("error");
            }
        };

        runChecks();
    }, []);

    const determineStep = (app: Application): number => {
        if (!app.personalInfo) return 1;
        if (!app.education) return 2;
        if (!app.motivation) return 3;
        if (!app.documents || app.documents.length === 0) return 4;
        return 5;
    };

    const handleRetry = () => {
        setStatus("checking");
        setError(null);
        setProgress(0);
        window.location.reload();
    };

    const handleStartApplication = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                router.push("/login?redirect=/applicant");
                return;
            }
            const newApp = await applicationService.startApplication(token);

            router.push(`/applicant/apply?step=1&id=${newApp.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to start application");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-4">Igire Rwanda</h1>
                    <p className="text-gray-500 text-sm">Application Portal</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Status Header */}
                    <div className={`p-6 ${
                        status === "error" ? "bg-red-50" : 
                        status === "checking" ? "bg-green-50" : "bg-green-50"
                    }`}>
                        <div className="flex items-center gap-4">
                            {status === "checking" && (
                                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                            )}
                            {status === "error" && (
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            )}
                            {(status === "submitted" || status === "has-application") && (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            )}
                            {(status === "no-cohort" || status === "no-application") && (
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <span className="text-yellow-600 text-lg">!</span>
                                </div>
                            )}
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    {status === "checking" && "Verifying Your Status"}
                                    {status === "error" && "Verification Failed"}
                                    {status === "no-cohort" && "Enrollment Required"}
                                    {status === "no-application" && "Ready to Apply"}
                                    {status === "has-application" && "Application Found"}
                                    {status === "submitted" && "Application Submitted"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {status === "checking" && "Please wait while we check your application..."}
                                    {status === "error" && error}
                                    {status === "no-cohort" && "Please select a program to continue"}
                                    {status === "no-application" && "Start your application journey"}
                                    {status === "has-application" && "Redirecting to your application..."}
                                    {status === "submitted" && "Redirecting to your dashboard..."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    {status === "checking" && (
                        <div className="p-6 space-y-4">
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                        step.done ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"
                                    }`}>
                                        {step.done ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            <span className="text-xs font-medium">{i + 1}</span>
                                        )}
                                    </div>
                                    <span className={`text-sm ${step.done ? "text-gray-900" : "text-gray-400"}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                            
                            {/* Progress Bar */}
                            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="p-6 border-t border-gray-100">
                        {status === "error" && (
                            <button
                                onClick={handleRetry}
                                className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                        )}

                        {status === "no-cohort" && (
                            <button
                                onClick={() => router.push("/applicant/onboarding")}
                                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                Select Program
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}

                        {status === "no-application" && (
                            <button
                                onClick={handleStartApplication}
                                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                Start Application
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}

                        {(status === "has-application" || status === "submitted") && (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Redirecting...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Having trouble? Contact support@igirerwanda.org
                </p>
            </div>
        </div>
    );
}
