'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: Step[];
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full">
      {/* Steps Container */}
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300" />

        {/* Active Progress Line */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-emerald-600 transition-all duration-500 ease-in-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Step Circles */}
        {steps.map((step) => (
          <div key={step.number} className="relative flex flex-col items-center z-10">
            {/* Circle */}
            <div
              className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                flex items-center justify-center
                font-semibold text-sm sm:text-base
                transition-all duration-300
                ${
                  currentStep > step.number
                    ? 'bg-emerald-600 text-white'
                    : currentStep === step.number
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-gray-300 text-gray-600'
                }
              `}
            >
              {currentStep > step.number ? (
                <Check size={20} className="text-white" />
              ) : (
                step.number
              )}
            </div>

            {/* Label - Hidden on mobile, visible on larger screens */}
            <span
              className={`
                mt-2 text-xs sm:text-sm font-medium text-center
                hidden sm:block
                ${currentStep >= step.number ? 'text-emerald-700' : 'text-gray-500'}
              `}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Page Indicator */}
      <div className="text-right mt-6">
        <span className="text-sm text-gray-500">
          Page {currentStep} of {steps.length}
        </span>
      </div>
    </div>
  );
};

export default ProgressStepper;
