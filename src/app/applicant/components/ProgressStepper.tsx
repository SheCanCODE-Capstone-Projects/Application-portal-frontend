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
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-shrink-0">
              {/* Circle */}
              <div
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                  rounded-full flex items-center justify-center 
                  font-semibold text-xs sm:text-sm md:text-base 
                  transition-all duration-300
                  ${
                    currentStep > step.number
                      ? 'bg-emerald-700 text-white'
                      : currentStep === step.number
                      ? 'bg-emerald-700 text-white ring-2 sm:ring-4 ring-emerald-100'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {currentStep > step.number ? (
                  <Check size={16} className="sm:w-5 sm:h-5" />
                ) : (
                  step.number
                )}
              </div>
              {/* Label */}
              <span
                className={`
                  mt-1 sm:mt-2 text-[10px] sm:text-xs 
                  font-medium text-center
                  ${currentStep >= step.number ? 'text-emerald-700' : 'text-gray-400'}
                `}
              >
                {step.title}
              </span>
            </div>
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 
                  transition-all duration-300
                  ${currentStep > step.number ? 'bg-emerald-700' : 'bg-gray-200'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;