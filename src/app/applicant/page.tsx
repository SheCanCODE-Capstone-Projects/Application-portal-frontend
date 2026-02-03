 "use client";

    import { useEffect, useState } from "react";
    import { useRouter } from "next/navigation";
    import { useAuth } from "@/context/AuthContext";
    import { applicationService } from "@/services/application/application-service";
    import { Application, ApplicationStatus } from "@/types/application/application";
    import { Loader2, CheckCircle, AlertCircle, GraduationCap, RefreshCw, FilePlus } from "lucide-react";
    import { AuroraBackground } from "@/components/background/page";
   import {ArrowRight} from "lucide-react";


 type CheckStatus = "checking" | "no-cohort" | "creating-application" | "redirecting" | "error";

    export default function ApplicantAuthenticator() {
        const router = useRouter();
        const { user, isAuthenticated, checkAuth, refreshProfile, userProfile } = useAuth();

        const [status, setStatus] = useState<CheckStatus>("checking");
        const [error, setError] = useState<string | null>(null);
        const [progress, setProgress] = useState(0);

        const steps = [
            { label: "Verifying session", done: progress >= 25 },
            { label: "Checking enrollment", done: progress >= 50 },
            { label: "Syncing application", done: progress >= 75 },
            { label: "Redirecting", done: progress >= 100 },
        ];

        useEffect(() => {
            let mounted = true;

            const runChecks = async () => {
                try {

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

                    const profile = await refreshProfile();
                    const currentCohortId = profile?.cohortId || userProfile?.cohortId;

                    setProgress(50);

                    if (!currentCohortId) {
                        setStatus("no-cohort");
                        return;
                    }

                    const token = localStorage.getItem("access_token");
                    if (!token) throw new Error("Session expired");

                    setProgress(75);
                    const existingApp = await applicationService.getMyApplication(token);

                    if (!existingApp) {
                        // CASE: Has Cohort but No Application -> Auto Start
                        setStatus("creating-application");

                        try {
                            const newApp = await applicationService.startApplication(token);

                            if (mounted) {
                                setProgress(100);
                                // Redirect to step 1
                                router.push(`/applicant/apply?step=1&id=${newApp.id}`);
                            }
                        } catch (createErr: any) {
                            console.error("Application creation failed:", createErr);
                            const errorMsg = createErr.response?.data?.message || createErr.message || "Failed to initialize application.";

                            // Handle the specific notification error gracefully if possible,
                            // though usually a 500 will stop the app creation.
                            if (mounted) {
                                setError(errorMsg);
                                setStatus("error");
                            }
                        }
                        return;
                    }

                    // CASE: Has Application -> Check Status
                    if (mounted) {
                        setProgress(100);
                        setStatus("redirecting");

                        const submittedStatuses: ApplicationStatus[] = [
                            ApplicationStatus.SUBMITTED,
                            ApplicationStatus.PENDING_REVIEW,
                            ApplicationStatus.UNDER_REVIEW,
                            ApplicationStatus.ACCEPTED,
                            ApplicationStatus.REJECTED,
                            ApplicationStatus.APPROVED,
                            ApplicationStatus.INTERVIEW_SCHEDULED,
                            ApplicationStatus.SYSTEM_REJECTED
                        ];

                        if (submittedStatuses.includes(existingApp.status)) {
                            router.push("/applicant/dashboard");
                        } else {
                            // Resume Draft
                            const step = determineStep(existingApp);
                            router.push(`/applicant/apply?step=${step}&id=${existingApp.id}`);
                        }
                    }

                } catch (err: any) {
                    console.error("Authentication check failed:", err);
                    if (mounted) {
                        setError(err.response?.data?.message || err.message || "Something went wrong");
                        setStatus("error");
                    }
                }
            };

            runChecks();

            return () => { mounted = false; };
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

        return (
            <AuroraBackground>
                <div className="min-h-screen flex items-center justify-center p-4 z-30">
                    <div className="max-w-md w-full">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                                <GraduationCap className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mt-4">Igire Rwanda</h1>
                            <p className="text-slate-500 text-sm">Application Portal</p>
                        </div>

                        {/* Main Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Status Header */}
                            <div className={`p-6 ${
                                status === "error" ? "bg-red-50" :
                                    status === "no-cohort" ? "bg-amber-50" : "bg-green-50"
                            }`}>
                                <div className="flex items-start gap-4">
                                    {status === "checking" && <Loader2 className="w-6 h-6 text-green-600 animate-spin mt-1" />}
                                    {status === "creating-application" && <FilePlus className="w-6 h-6 text-green-600 animate-pulse mt-1" />}
                                    {status === "redirecting" && <CheckCircle className="w-6 h-6 text-green-600 mt-1" />}
                                    {status === "error" && <AlertCircle className="w-6 h-6 text-red-500 mt-1" />}
                                    {status === "no-cohort" && <AlertCircle className="w-6 h-6 text-amber-500 mt-1" />}

                                    <div>
                                        <h2 className="font-bold text-gray-900 text-lg">
                                            {status === "checking" && "Verifying Status"}
                                            {status === "creating-application" && "Starting Application..."}
                                            {status === "redirecting" && "Redirecting..."}
                                            {status === "error" && "Verification Failed"}
                                            {status === "no-cohort" && "Enrollment Required"}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                            {status === "checking" && "Please wait while we verify your enrollment and application status."}
                                            {status === "creating-application" && "We are setting up your application profile for the selected cohort."}
                                            {status === "redirecting" && "Taking you to your workspace."}
                                            {status === "error" && error}
                                            {status === "no-cohort" && "You haven't joined a cohort yet. Please select a program to continue."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Steps (Only show when not in error/action state) */}
                            {(status === "checking" || status === "creating-application" || status === "redirecting") && (
                                <div className="p-6 space-y-4">
                                    {steps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                                                step.done ? "bg-green-600 text-white" : "bg-gray-100 text-gray-300"
                                            }`}>
                                                {step.done && <CheckCircle className="w-3 h-3" />}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors duration-300 ${
                                                step.done ? "text-gray-900" : "text-gray-400"
                                            }`}>
                                            {step.label}
                                        </span>
                                        </div>
                                    ))}

                                    <div className="mt-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-600 transition-all duration-500 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                {status === "error" && (
                                    <button
                                        onClick={handleRetry}
                                        className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Retry Connection
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
                            </div>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-6">
                            Need help? Contact support@igirerwanda.org
                        </p>
                    </div>
                </div>
            </AuroraBackground>
        );
    }