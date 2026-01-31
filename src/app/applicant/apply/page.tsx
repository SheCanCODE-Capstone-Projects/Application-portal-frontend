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
import VulnerabilityStep from '../components/VulnerabilityStep'; // New Component
import EmergencyContactStep from '../components/EmergencyContactStep';
import ReviewStep from '../components/ReviewStep';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from "sonner";
import { ApplicationStatus, Application } from '@/types/application/application';
import { AuroraBackground } from "@/components/background/page";

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
                setInitializing(false);
            } else {
                const newApp = await applicationService.startApplication(token);
                setAppId(newApp.id);
                setApplicationData(newApp);
                router.replace(`/applicant/apply?step=1&id=${newApp.id}`);
                setInitializing(false);
            }
        } catch (err: any) {
            toast.error("Session error. Please log in again.");
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
            // Updated Switch for new steps
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
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Failed to save information";
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
        } catch (err: any) {
            const msg = err.response?.data?.message || "Submission failed";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    if (initializing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
                <p className="text-gray-600 font-medium tracking-tight">Loading application...</p>
            </div>
        );
    }

    // Updated Steps Array
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
            <div className="min-h-screen py-12 px-4 z-10">
                <div className="max-w-12xl mx-auto">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-gray-100 overflow-hidden transition-all">
                        <div className="bg-[#0f5d3f] p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                                    Application Portal <Sparkles className="text-yellow-400" />
                                </h1>
                                <p className="text-emerald-100/80 mt-2 font-medium">Complete your profile to join the next cohort.</p>
                            </div>

                            <div className="mt-10 overflow-x-auto pb-4">
                                <ProgressStepper currentStep={currentStep} steps={steps} />
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
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