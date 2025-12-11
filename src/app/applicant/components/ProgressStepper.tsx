'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  label: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: Step[];
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center font-semibold text-sm md:text-lg transition-all duration-300 ${
                  currentStep > step.number
                    ? 'bg-emerald-700 text-white'
                    : currentStep === step.number
                    ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.number ? <Check size={20} className="md:w-6 md:h-6" /> : step.number}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm font-medium text-center ${
                  currentStep >= step.number ? 'text-emerald-700' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1 md:mx-2 transition-all duration-300 ${
                  currentStep > step.number ? 'bg-emerald-700' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;