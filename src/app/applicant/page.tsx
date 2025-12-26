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
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Single Continuous Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header with Title */}
          <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Registration
            </h1>
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