// src/app/applicant/components/MotivationStep.tsx
"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Target, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MotivationDto } from "@/types/application/application";

// --- Standardized Design Classes ---
// Matches the professional style of PersonalInfoStep and EducationStep
const inputClass = "w-full p-5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 text-slate-700 shadow-sm hover:border-emerald-300 resize-none leading-relaxed";
const labelClass = "text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 mb-3";

export default function MotivationStep({ initialData, onNext, onBack, saving }: any) {
    const [data, setData] = useState<MotivationDto>({
        whyJoin: "",
        futureGoals: "",
        preferredCourse: ""
    });

    // FIX: Load initial data when component mounts so the text "returns"
    useEffect(() => {
        if (initialData) {
            setData((prev) => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleSubmit = () => {
        if (!data.whyJoin || data.whyJoin.length < 20) {
            toast.error("Please provide a detailed motivation (min 20 chars).");
            return;
        }
        if (!data.futureGoals || data.futureGoals.length < 20) {
            toast.error("Please provide details about your future goals (min 20 chars).");
            return;
        }
        onNext(data);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Unified 2-column grid layout for larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Motivation Input */}
                <div className="space-y-1">
                    <label className={labelClass}>
                        <MessageSquare size={14} /> Why do you want to join this program? *
                    </label>
                    <textarea
                        rows={8}
                        className={inputClass}
                        placeholder="Tell us about your motivation..."
                        value={data.whyJoin} // FIX: Bind value to state to show saved data
                        onChange={e => setData({...data, whyJoin: e.target.value})}
                    />
                </div>

                {/* Goals Input */}
                <div className="space-y-1">
                    <label className={labelClass}>
                        <Target size={14} /> What are your future career goals? *
                    </label>
                    <textarea
                        rows={8}
                        className={inputClass}
                        placeholder="Where do you see yourself in 3 years?"
                        value={data.futureGoals} // FIX: Bind value to state to show saved data
                        onChange={e => setData({...data, futureGoals: e.target.value})}
                    />
                </div>
            </div>

            {/* Standardized Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-[1.5] py-4 bg-[#0f5d3f] hover:bg-[#0a4330] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/20 transition-all disabled:opacity-70"
                >
                    {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <>Save & Continue <ArrowRight size={18} /></>}
                </button>
            </div>
        </div>
    );
}