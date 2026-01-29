"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applicationService } from '@/services/application/application-service';
import { useAuth } from '@/context/AuthContext';
import ProgressStepper from '../components/ProgressStepper';
import PersonalInfoStep from '../components/PersonalInfoStep';
import EducationStep from '../components/EducationStep';
import MotivationStep from '../components/MotivationStep';
import DocumentsStep from '../components/DocumentsStep';
import EmergencyContactStep from '../components/EmergencyContactStep';
import ReviewStep from '../components/ReviewStep';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from "sonner";
import { ApplicationStatus } from '@/types/application/application';

export default function ApplyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkAuth } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [appId, setAppId] = useState<string | null>(searchParams.get('id'));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initializing, setInitializing] = useState(true);

    const initializeApplication = useCallback(async () => {
        try {
            // Don't setInitializing(true) here; it's already true by default.

            const token = localStorage.getItem("access_token");
            if (!token) {
                router.push("/login?redirect=/applicant/apply");
                return; // Keep loading while redirecting
            }

            // 1. Check for existing application
            const existingApp = await applicationService.getMyApplication(token);

            if (existingApp) {
                // 2. APPLY ONCE LOGIC: If already submitted, redirect to dashboard
                if (existingApp.status !== ApplicationStatus.DRAFT) {
                    toast.info("You have already submitted an application.");
                    router.push("/applicant/dashboard");
                    return; // Keep loading while redirecting (Prevents Flash)
                }
                // 3. If DRAFT, resume session
                setAppId(existingApp.id);
                setInitializing(false); // Only stop loading if we are staying here
            } else {
                // 4. No application found? Start one via backend
                const newApp = await applicationService.startApplication(token);
                setAppId(newApp.id);
                router.replace(`/applicant/apply?step=1&id=${newApp.id}`);
                setInitializing(false); // Only stop loading if we are staying here
            }
        } catch (err: any) {
            toast.error("Session error. Please log in again.");
            setInitializing(false); // Stop loading on error so they can see the error or empty state
        }
        // REMOVED finally block to prevent disabling loader during redirects
    }, [router]);

    useEffect(() => {
        initializeApplication();
    }, [initializeApplication]);

    // Handle next step logic
    const handleNext = async (data: any) => {
        const token = localStorage.getItem("access_token");
        if (!token || !appId) return;

        setSaving(true);
        setError(null);
        try {
            switch (currentStep) {
                case 1: await applicationService.savePersonalInfo(appId, data, token); break;
                case 2: await applicationService.saveEducation(appId, data, token); break;
                case 3: await applicationService.saveMotivation(appId, data, token); break;
                case 4: await applicationService.saveDocuments(appId, data, token); break;
                case 5: await applicationService.saveEmergencyContacts(appId, data, token); break;
            }

            const next = currentStep + 1;
            setCurrentStep(next);
            router.push(`/applicant/apply?step=${next}&id=${appId}`);
            window.scrollTo(0, 0);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save information");
            toast.error("Validation Error: Please check required fields");
        } finally {
            setSaving(false);
        }
    };

    // Handle final submission
    const handleFinalSubmit = async () => {
        const token = localStorage.getItem("access_token");
        if (!token || !appId) return;

        setSaving(true);
        try {
            await applicationService.submitApplication(appId, token);
            await checkAuth();
            toast.success("Application submitted successfully!");
            router.push('/applicant/dashboard?submitted=true');
        } catch (err: any) {
            const msg = err.response?.data?.message || "Submission failed";
            setError(msg);
            toast.error("Application is incomplete: " + msg);
        } finally {
            setSaving(false);
        }
    };

    // Show persistent loading screen while checking status
    if (initializing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
                <p className="text-gray-600 font-medium tracking-tight">Verifying application status...</p>
            </div>
        );
    }

    const steps = [
        { number: 1, title: 'Personal' },
        { number: 2, title: 'Education' },
        { number: 3, title: 'Motivation' },
        { number: 4, title: 'Documents' },
        { number: 5, title: 'Contacts' },
        { number: 6, title: 'Review' }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 shadow-sm animate-in slide-in-from-top-2">
                        <AlertCircle size={20} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-gray-100 overflow-hidden transition-all">
                    <div className="bg-[#0f5d3f] p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                                Application Portal <Sparkles className="text-yellow-400" />
                            </h1>
                            <p className="text-emerald-100/80 mt-2 font-medium">Join the next cohort of Igire Rwanda leaders.</p>
                        </div>

                        <div className="mt-10 overflow-x-auto">
                            <ProgressStepper currentStep={currentStep} steps={steps} />
                        </div>
                    </div>

                    <div className="p-10">
                        {currentStep === 1 && <PersonalInfoStep onNext={handleNext} saving={saving} />}
                        {currentStep === 2 && <EducationStep onNext={handleNext} onBack={() => setCurrentStep(1)} saving={saving} />}
                        {currentStep === 3 && <MotivationStep onNext={handleNext} onBack={() => setCurrentStep(2)} saving={saving} />}
                        {currentStep === 4 && <DocumentsStep onNext={handleNext} onBack={() => setCurrentStep(3)} saving={saving} />}
                        {currentStep === 5 && <EmergencyContactStep onNext={handleNext} onBack={() => setCurrentStep(4)} saving={saving} />}
                        {currentStep === 6 && <ReviewStep onSubmit={handleFinalSubmit} onBack={() => setCurrentStep(5)} saving={saving} />}
                    </div>
                </div>

                <p className="text-center text-gray-400 text-xs mt-8">
                    Application ID: <span className="font-mono">{appId}</span>
                </p>
            </div>
        </div>
    );
}