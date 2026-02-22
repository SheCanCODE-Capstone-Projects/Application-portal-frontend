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
import DisabilityStep from '../components/DisabilityStep';
import VulnerabilityStep from '../components/VulnerabilityStep';
import EmergencyContactStep from '../components/EmergencyContactStep';
import ReviewStep from '../components/ReviewStep';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from "sonner";
import { ApplicationStatus, Application } from '@/types/application/application';
import { AuroraBackground } from "@/components/background/page";
import axios from "axios";

export default function ApplyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkAuth } = useAuth();

    const stepParam = searchParams.get('step');
    const initialStep = stepParam ? parseInt(stepParam) : 1;

    const [currentStep, setCurrentStep] = useState(initialStep);
    const [appId, setAppId] = useState<string | null>(searchParams.get('id'));
    const [applicationData, setApplicationData] = useState<Application | null>(null);
    const [saving, setSaving] = useState(false);
    const [initializing, setInitializing] = useState(true);

    const initializeApplication = useCallback(async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                router.push("/login?redirect=/applicant/apply");
                return;
            }

            const existingApp = await applicationService.getMyApplication(token);

            if (existingApp) {
                if (existingApp.status !== ApplicationStatus.DRAFT) {
                    toast.info("You have already submitted an application.");
                    router.push("/applicant/dashboard");
                    return;
                }
                setAppId(existingApp.id);
                setApplicationData(existingApp);
            } else {
                const newApp = await applicationService.startApplication(token);
                setAppId(newApp.id);
                setApplicationData(newApp);
                router.replace(`/applicant/apply?step=1&id=${newApp.id}`);
            }
        } catch (error: unknown) {
            let message = "Failed to initialize application";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            toast.error(message);
        } finally {
            setInitializing(false);
        }
    }, [router]);

    useEffect(() => {
        initializeApplication();
    }, [initializeApplication]);

    useEffect(() => {
        if (stepParam) {
            setCurrentStep(parseInt(stepParam));
        }
    }, [stepParam]);

    const handleNext = async (data: any) => {
        const token = localStorage.getItem("access_token");
        if (!token || !appId) return;

        setSaving(true);
        try {
            let updatedApp;
            switch (currentStep) {
                case 1: updatedApp = await applicationService.savePersonalInfo(appId, data, token); break;
                case 2: updatedApp = await applicationService.saveEducation(appId, data, token); break;
                case 3: updatedApp = await applicationService.saveMotivation(appId, data, token); break;
                case 4: updatedApp = await applicationService.saveDocuments(appId, data, token); break;
                case 5: updatedApp = await applicationService.saveDisability(appId, data, token); break;
                case 6: updatedApp = await applicationService.saveVulnerability(appId, data, token); break;
                case 7: updatedApp = await applicationService.saveEmergencyContacts(appId, data, token); break;
            }

            if (updatedApp) {
                setApplicationData(updatedApp);
                toast.success("Progress saved successfully!");
            }

            const next = currentStep + 1;
            router.push(`/applicant/apply?step=${next}&id=${appId}`);
            window.scrollTo(0, 0);
        } catch (err: unknown) {
            let errorMsg = "Failed to save information";

            if (axios.isAxiosError(err)) {
                errorMsg = err.response?.data?.message || errorMsg;
            } else if (err instanceof Error) {
                errorMsg = err.message;
            }

            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        const prev = currentStep - 1;
        if (prev >= 1) {
            router.push(`/applicant/apply?step=${prev}&id=${appId}`);
        }
    };

    const handleFinalSubmit = async () => {
        const token = localStorage.getItem("access_token");
        if (!token || !appId) return;

        setSaving(true);
        try {
            await applicationService.submitApplication(appId, token);
            await checkAuth();
            toast.success("Application submitted successfully!");
            router.push('/applicant/dashboard?submitted=true');
        } catch (err: unknown) {
            let errorMsg = "Failed to submit application";
            if (axios.isAxiosError(err)) {
                errorMsg = err.response?.data?.message || errorMsg;
            } else if (err instanceof Error) {
                errorMsg = err.message;
            }
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    if (initializing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-emerald-600 mb-4" />
                <p className="text-gray-600 font-medium tracking-tight text-sm sm:text-base">Loading application...</p>
            </div>
        );
    }

    const steps = [
        { number: 1, title: 'Personal' },
        { number: 2, title: 'Education' },
        { number: 3, title: 'Motivation' },
        { number: 4, title: 'Documents' },
        { number: 5, title: 'Disability' },
        { number: 6, title: 'Vulnerability' },
        { number: 7, title: 'Contacts' },
        { number: 8, title: 'Review' }
    ];

    return (
        <AuroraBackground>
            <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-4 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-gray-100 overflow-hidden transition-all">
                        {/* Header */}
                        <div className="bg-[#0f5d3f] p-6 sm:p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10">
                                <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap">
                                    Application Portal
                                    <Sparkles className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
                                </h1>
                                <p className="text-emerald-100/80 mt-2 font-medium text-sm sm:text-base">
                                    Complete your profile to join the next cohort.
                                </p>
                            </div>

                            {/* Progress Stepper - Scrollable on mobile */}
                            <div className="mt-6 sm:mt-10 overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0">
                                <ProgressStepper currentStep={currentStep} steps={steps} />
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-4 sm:p-8 md:p-12">
                            {currentStep === 1 && <PersonalInfoStep initialData={applicationData?.personalInfo} onNext={handleNext} saving={saving} />}
                            {currentStep === 2 && <EducationStep initialData={applicationData?.education} onNext={handleNext} onBack={handleBack} saving={saving} />}
                            {currentStep === 3 && <MotivationStep initialData={applicationData?.motivation} onNext={handleNext} onBack={handleBack} saving={saving} />}
                            {currentStep === 4 && <DocumentsStep initialData={applicationData?.documents} onNext={handleNext} onBack={handleBack} saving={saving} />}
                            {currentStep === 5 && <DisabilityStep initialData={applicationData?.disability} onNext={handleNext} onBack={handleBack} saving={saving} />}
                            {currentStep === 6 && <VulnerabilityStep initialData={applicationData?.vulnerability} onNext={handleNext} onBack={handleBack} saving={saving} />}
                            {currentStep === 7 && <EmergencyContactStep initialData={applicationData?.emergencyContacts} onNext={handleNext} onBack={handleBack} saving={saving} />}
                            {currentStep === 8 && <ReviewStep onSubmit={handleFinalSubmit} onBack={handleBack} saving={saving} />}
                        </div>
                    </div>
                </div>
            </div>
        </AuroraBackground>
    );
}