"use client";

import { Check } from "lucide-react";

export default function ProgressStepper({ currentStep, steps }: { currentStep: number, steps: any[] }) {
    return (
        <div className="flex items-center justify-between relative min-w-max sm:min-w-0">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 -z-10 hidden sm:block" />

            {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center gap-1.5 sm:gap-2">
                    {/* Step Circle */}
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all text-xs sm:text-sm ${
                        currentStep > step.number
                            ? "bg-emerald-600 text-white"
                            : currentStep === step.number
                                ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-600"
                                : "bg-white text-gray-400 border-2 border-gray-200"
                    }`}>
                        {currentStep > step.number ? <Check size={16} className="sm:w-5 sm:h-5" /> : step.number}
                    </div>

                    {/* Step Label */}
                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                        currentStep >= step.number ? "text-emerald-800" : "text-gray-400"
                    }`}>
                        {step.title}
                    </span>
                </div>
            ))}
        </div>
    );
}