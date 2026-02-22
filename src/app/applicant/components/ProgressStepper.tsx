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

    // Helper to calculate visible indexes
    const getVisibleIndexes = (count: number) => {
        if (steps.length <= count) {
            return steps.map((_, i) => i);
        }

        if (activeIndex <= 0) {
            return Array.from({ length: count }, (_, i) => i);
        }

        if (activeIndex >= steps.length - 1) {
            return Array.from(
                { length: count },
                (_, i) => steps.length - count + i
            );
        }

        const start = Math.max(0, activeIndex - 1);
        return Array.from({ length: count }, (_, i) => start + i);
    };

    const mobileIndexes = getVisibleIndexes(2);
    const mediumIndexes = getVisibleIndexes(3);

    // Progress line percentage (based on total steps)
    const progressPercentage =
        steps.length > 1
            ? (activeIndex / (steps.length - 1)) * 100
            : 0;

    return (
        <div className="relative w-full mx-auto">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200 -z-10" />

            {/* Active Progress Line */}
            <div
                className="absolute top-5 left-0 h-[2px] bg-emerald-600 transition-all duration-500 ease-in-out -z-10"
                style={{ width: `${progressPercentage}%` }}
            />

            <div className="flex items-start justify-between">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;

                    return (
                        <div
                            key={step.number}
                            className={`
                flex-col items-center text-center transition-all duration-300 p-4
                ${
                                mobileIndexes.includes(index)
                                    ? "flex"
                                    : "hidden"
                            }
                ${
                                mediumIndexes.includes(index)
                                    ? "md:flex"
                                    : ""
                            }
                lg:flex
              `}
                        >
                            {/* Circle */}
                            <div
                                className={`
                  w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-semibold
                  transition-all duration-300 shadow-sm
                  ${
                                    isCompleted
                                        ? "bg-emerald-600 text-white"
                                        : isActive
                                            ? "bg-white text-emerald-700 border-2 border-emerald-600 ring-4 ring-emerald-50 scale-110"
                                            : "bg-white text-gray-400 border-2 border-gray-200"
                                }
                `}
                            >
                                {isCompleted ? (
                                    <Check size={18} className="stroke-[3]" />
                                ) : (
                                    step.number
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`
                  mt-2 text-[11px] sm:text-xs font-semibold tracking-wide
                  transition-all duration-300
                  ${
                                    isActive
                                        ? "text-emerald-700 scale-105"
                                        : isCompleted
                                            ? "text-emerald-600"
                                            : "text-gray-400"
                                }
                `}
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