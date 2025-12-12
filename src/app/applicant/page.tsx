
'use client';

import React, { useState } from 'react';
import ProgressStepper from './components/ProgressStepper';
import PersonalInfoStep from './components/PersonalInfoStep';
import EducationStep from './components/EducationStep';
import WorkExperienceStep from './components/WorkExperienceStep';
import DocumentsStep from './components/DocumentsStep';
import ReviewStep from './components/ReviewStep';
import { FormData } from './types/form.types';

export default function ApplicantPage() {
  const [currentStep, setCurrentStep] = useState(1);
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

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      onNext: nextStep,
      onBack: prevStep,
    };

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
        return <ReviewStep {...stepProps} />;
      default:
        return <PersonalInfoStep {...stepProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <ProgressStepper currentStep={currentStep} steps={steps} />

        <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Registration</h1>
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-6">
            {steps[currentStep - 1].title} {currentStep > 1 && currentStep < 5 ? 'Background' : currentStep === 4 ? 'Upload' : currentStep === 5 ? '& Confirm' : 'Information'}
          </h2>

          {renderStep()}
        </div>
      </div>
    </div>
  );
}
