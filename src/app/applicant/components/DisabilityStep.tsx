// src/app/applicant/components/DisabilityStep.tsx
"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { DisabilityDto } from "@/types/application/application";

export default function DisabilityStep({ onNext, onBack, saving }: any) {
    const [data, setData] = useState<DisabilityDto>({
        hasDisability: false,
        disabilityType: "",
        disabilityDescription: ""
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
                <AlertCircle className="text-emerald-700 mt-1" size={24} />
                <p className="text-emerald-800 text-sm leading-relaxed font-medium">
                    We are committed to inclusivity. Providing this information helps us ensure appropriate
                    accommodations are available for all participants.
                </p>
            </div>

            <div className="space-y-6">
                <label className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                    <input
                        type="checkbox"
                        className="w-5 h-5 rounded accent-emerald-600"
                        checked={data.hasDisability}
                        onChange={e => setData({...data, hasDisability: e.target.checked})}
                    />
                    <span className="font-bold text-gray-700 uppercase text-xs tracking-widest">
            I identify as a person with a disability
          </span>
                </label>

                {data.hasDisability && (
                    <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-emerald-900">Type of Disability</label>
                            <input
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="e.g. Visual Impairment"
                                value={data.disabilityType}
                                onChange={e => setData({...data, disabilityType: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-emerald-900">Accommodations Needed</label>
                            <textarea
                                rows={3}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                placeholder="Describe any support or tools you might need..."
                                value={data.disabilityDescription}
                                onChange={e => setData({...data, disabilityDescription: e.target.value})}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button onClick={onBack} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all">
                    <ArrowLeft size={18} /> Back
                </button>
                <button
                    onClick={() => onNext(data)}
                    disabled={saving}
                    className="flex-[2] py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <>Save & Continue <ArrowRight size={18} /></>}
                </button>
            </div>
        </div>
    );
}