'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApplication } from '@/hooks/application/useApplication';
import { applicationService } from '@/services/application/application-service';
import { Loader2, AlertCircle } from 'lucide-react';

interface FormData {
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
    };
    education: Array<{ name: string; degree: string; grade: string; startDate: string; endDate: string }>;
    workExperience: Array<{ company: string; position: string; duration: string; responsibilities: string }>;
    cv: File | null;
    coverLetter: File | null;
    certificates: File[];
}

const ProgressStepper = ({ currentStep, steps }: { currentStep: number; steps: Array<{ number: number; title: string }> }) => (
    <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep >= step.number 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : 'border-gray-300 text-gray-400'
                }`}>
                    {step.number}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block ${
                    currentStep >= step.number ? 'text-green-600' : 'text-gray-400'
                }`}>
                    {step.title}
                </span>
                {index < steps.length - 1 && (
                    <div className={`w-12 md:w-24 h-0.5 mx-2 ${
                        currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                )}
            </div>
        ))}
    </div>
);

interface StepProps {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
    applicationId?: string;
    saving?: boolean;
}

const PersonalInfoStep = ({ formData, updateFormData, onNext, saving }: StepProps) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                    type="text"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => updateFormData({ personalInfo: { ...formData.personalInfo, firstName: e.target.value }})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter first name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                    type="text"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => updateFormData({ personalInfo: { ...formData.personalInfo, lastName: e.target.value }})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter last name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => updateFormData({ personalInfo: { ...formData.personalInfo, email: e.target.value }})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter email"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => updateFormData({ personalInfo: { ...formData.personalInfo, phone: e.target.value }})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter phone number"
                />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
                type="text"
                value={formData.personalInfo.address}
                onChange={(e) => updateFormData({ personalInfo: { ...formData.personalInfo, address: e.target.value }})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter address"
            />
        </div>
        <div className="flex justify-end pt-4">
            <button
                onClick={onNext}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save & Continue
            </button>
        </div>
    </div>
);

const EducationStep = ({ formData, updateFormData, onNext, onBack, saving }: StepProps) => (
    <div className="space-y-6">
        {formData.education.map((edu, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
                        <input
                            type="text"
                            value={edu.name}
                            onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[index].name = e.target.value;
                                updateFormData({ education: newEdu });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter institution name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                        <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[index].degree = e.target.value;
                                updateFormData({ education: newEdu });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter degree"
                        />
                    </div>
                </div>
            </div>
        ))}
        <button
            onClick={() => updateFormData({ education: [...formData.education, { name: '', degree: '', grade: '', startDate: '', endDate: '' }]})}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
            + Add Another Education
        </button>
        <div className="flex justify-between pt-4">
            <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Back
            </button>
            <button
                onClick={onNext}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save & Continue
            </button>
        </div>
    </div>
);

const WorkExperienceStep = ({ formData, updateFormData, onNext, onBack, saving }: StepProps) => (
    <div className="space-y-6">
        {formData.workExperience.map((exp, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                                const newExp = [...formData.workExperience];
                                newExp[index].company = e.target.value;
                                updateFormData({ workExperience: newExp });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter company name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                                const newExp = [...formData.workExperience];
                                newExp[index].position = e.target.value;
                                updateFormData({ workExperience: newExp });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter position"
                        />
                    </div>
                </div>
            </div>
        ))}
        <button
            onClick={() => updateFormData({ workExperience: [...formData.workExperience, { company: '', position: '', duration: '', responsibilities: '' }]})}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
            + Add Another Experience
        </button>
        <div className="flex justify-between pt-4">
            <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Back
            </button>
            <button
                onClick={onNext}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save & Continue
            </button>
        </div>
    </div>
);

const DocumentsStep = ({ onNext, onBack, saving }: StepProps) => (
    <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">Drag and drop your documents here, or click to browse</p>
            <input type="file" className="hidden" id="file-upload" multiple />
            <label htmlFor="file-upload" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                Browse Files
            </label>
        </div>
        <div className="flex justify-between pt-4">
            <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Back
            </button>
            <button
                onClick={onNext}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save & Continue
            </button>
        </div>
    </div>
);

const ReviewStep = ({ formData, onBack, saving }: StepProps & { onSubmit: () => void }) => (
    <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
            <p className="text-gray-600">{formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
            <p className="text-gray-600">{formData.personalInfo.email}</p>
            <p className="text-gray-600">{formData.personalInfo.phone}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Education</h3>
            {formData.education.map((edu, i) => (
                <p key={i} className="text-gray-600">{edu.name} - {edu.degree}</p>
            ))}
        </div>
        <div className="flex justify-between pt-4">
            <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Back
            </button>
            <button
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Application
            </button>
        </div>
    </div>
);

export default function ApplicantPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuth();
    const { application, loading: appLoading, error: appError, fetchMyApplication } = useApplication();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        personalInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
        },
        education: [{ name: '', degree: '', grade: '', startDate: '', endDate: '' }],
        workExperience: [{ company: '', position: '', duration: '', responsibilities: '' }],
        cv: null,
        coverLetter: null,
        certificates: [],
    });

    const steps = [
        { number: 1, title: 'Personal' },
        { number: 2, title: 'Education' },
        { number: 3, title: 'Work' },
        { number: 4, title: 'Documents' },
        { number: 5, title: 'Review' },
    ];

    // Initialize from URL params and check auth
    useEffect(() => {
        const init = async () => {
            await checkAuth();
            
            const stepParam = searchParams.get('step');
            const idParam = searchParams.get('id');

            if (stepParam) {
                const step = parseInt(stepParam, 10);
                if (step >= 1 && step <= 5) {
                    setCurrentStep(step);
                }
            }

            if (idParam) {
                setApplicationId(idParam);
            }

            // Fetch existing application
            const existingApp = await fetchMyApplication();
            if (existingApp) {
                setApplicationId(existingApp.id);
                // Populate form with existing data
                if (existingApp.personalInfo) {
                    const nameParts = existingApp.personalInfo.fullName?.split(' ') || ['', ''];
                    setFormData(prev => ({
                        ...prev,
                        personalInfo: {
                            firstName: nameParts[0] || '',
                            lastName: nameParts.slice(1).join(' ') || '',
                            email: existingApp.personalInfo?.email || user?.email || '',
                            phone: existingApp.personalInfo?.phone || '',
                            address: existingApp.personalInfo?.nationality || '',
                        }
                    }));
                }
            }

            setInitialized(true);
        };

        init();
    }, [searchParams, checkAuth, fetchMyApplication, user?.email]);

    // Redirect if not authenticated
    useEffect(() => {
        if (initialized && !isAuthenticated) {
            router.push('/login?redirect=/applicant/apply');
        }
    }, [initialized, isAuthenticated, router]);

    // Redirect if admin
    useEffect(() => {
        if (initialized && user?.role === 'ADMIN') {
            router.push('/admin');
        }
    }, [initialized, user, router]);

    const updateFormData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = async () => {
        setSaving(true);
        setError(null);

        try {
            // Save current step data to API
            const token = localStorage.getItem('access_token');
            if (!token || !applicationId) {
                if (currentStep < 5) setCurrentStep(currentStep + 1);
                return;
            }

            // Save based on current step
            switch (currentStep) {
                case 1:
                    await applicationService.savePersonalInfo(applicationId, {
                        fullName: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
                        email: formData.personalInfo.email,
                        phone: formData.personalInfo.phone,
                        gender: 'PREFER_NOT_TO_SAY',
                        nationality: formData.personalInfo.address,
                    }, token);
                    break;
                case 2:
                    await applicationService.saveEducation(applicationId, {
                        highestEducationLevel: 'OTHER',
                        highestEducation: formData.education[0]?.degree || '',
                        occupation: '',
                        employmentStatus: '',
                        yearsExperience: 0,
                    }, token);
                    break;
                case 3:
                    await applicationService.saveMotivation(applicationId, {
                        whyJoin: '',
                        futureGoals: '',
                        preferredCourse: '',
                    }, token);
                    break;
            }

            if (currentStep < 5) {
                setCurrentStep(currentStep + 1);
                // Update URL
                router.push(`/applicant/apply?step=${currentStep + 1}&id=${applicationId}`);
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Failed to save';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            if (applicationId) {
                router.push(`/applicant/apply?step=${currentStep - 1}&id=${applicationId}`);
            }
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            if (!token || !applicationId) {
                setError('Not authenticated');
                return;
            }

            await applicationService.submitApplication(applicationId, token);
            router.push('/applicant/dashboard?submitted=true');
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Failed to submit';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const getStepTitle = () => {
        const titles = [
            'Personal Information',
            'Education Background',
            'Work Experience',
            'Documents Upload',
            'Review & Confirm',
        ];
        return titles[currentStep - 1];
    };

    // Loading state
    if (!initialized || appLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading your application...</p>
                </div>
            </div>
        );
    }

    const stepProps: StepProps = {
        formData,
        updateFormData,
        onNext: nextStep,
        onBack: prevStep,
        applicationId: applicationId || undefined,
        saving,
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <PersonalInfoStep {...stepProps} />;
            case 2:
                return <EducationStep {...stepProps} />;
            case 3:
                return <WorkExperienceStep {...stepProps} />;
            case 4:
                return <DocumentsStep {...stepProps} />;
            case 5:
                return <ReviewStep {...stepProps} onSubmit={handleSubmit} />;
            default:
                return <PersonalInfoStep {...stepProps} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
            <div className="max-w-4xl mx-auto">
                {/* Error Banner */}
                {(error || appError) && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-700">{error || appError}</p>
                        <button 
                            onClick={() => setError(null)} 
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Single Continuous Card */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Header with Title */}
                    <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                            Registration
                        </h1>
                        {applicationId && (
                            <p className="text-sm text-gray-500 mt-1">Application ID: {applicationId}</p>
                        )}
                    </div>

                    {/* Progress Stepper */}
                    <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
                        <ProgressStepper currentStep={currentStep} steps={steps} />
                    </div>

                    {/* Form Content */}
                    <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                            {getStepTitle()}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 mb-6">
                            Please fill in the required information below.
                        </p>

                        {renderStep()}
                    </div>
                </div>
            </div>
        </div>
    );
}
