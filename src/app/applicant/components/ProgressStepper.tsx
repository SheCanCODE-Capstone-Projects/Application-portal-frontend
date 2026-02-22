"use client";

import { Check } from "lucide-react";

interface Step {
    number: number;
    title: string;
}

export default function ProgressStepper({
                                            currentStep,
                                            steps,
                                        }: {
    currentStep: number;
    steps: Step[];
}) {
    const activeIndex = steps.findIndex((s) => s.number === currentStep);

    // --- MOBILE: Show 3 steps (Previous, Current, Next)
    let mobileIndexes: number[] = [];

    if (activeIndex <= 0) {
        mobileIndexes = [0, 1, 2];
    } else if (activeIndex >= steps.length - 1) {
        mobileIndexes = [
            steps.length - 3,
            steps.length - 2,
            steps.length - 1,
        ];
    } else {
        mobileIndexes = [activeIndex - 1, activeIndex, activeIndex + 1];
    }

    // Prevent negative indexes
    mobileIndexes = mobileIndexes.filter(
        (i) => i >= 0 && i < steps.length
    );

    // Progress line percentage
    const progressPercentage =
        ((activeIndex) / (steps.length - 1)) * 100;

    return (
        <div className="relative w-full sm:max-w-none mx-auto">

            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200 -z-10" />

            {/* Active Progress Line */}
            <div
                className="absolute top-5 left-0 h-[2px] bg-emerald-600 transition-all duration-500 ease-in-out -z-10"
                style={{ width: `${progressPercentage}%` }}
            />

            <div className="flex items-start justify-between">
                {steps.map((step, index) => {
                    const isMobileVisible = mobileIndexes.includes(index);
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;

                    return (
                        <div
                            key={step.number}
                            className={`flex-col items-center text-center transition-all duration-300 p-4
              ${isMobileVisible ? "flex" : "hidden sm:flex"}`}
                        >
                            {/* Circle */}
                            <div
                                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-semibold transition-all duration-300 shadow-sm
                ${
                                    isCompleted
                                        ? "bg-emerald-600 text-white"
                                        : isActive
                                            ? "bg-white text-emerald-700 border-2 border-emerald-600 ring-4 ring-emerald-50 scale-110"
                                            : "bg-white text-gray-400 border-2 border-gray-200"
                                }`}
                            >
                                {isCompleted ? (
                                    <Check size={18} className="stroke-[3]" />
                                ) : (
                                    step.number
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`mt-2 text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-300
                ${
                                    isActive
                                        ? "text-emerald-700 scale-105"
                                        : isCompleted
                                            ? "text-emerald-600"
                                            : "text-gray-400"
                                }`}
                            >
                {step.title}
              </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}