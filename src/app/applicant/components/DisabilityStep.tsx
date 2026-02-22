"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Loader2, Accessibility } from "lucide-react";
import { DisabilityDto } from "@/types/application/application";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
    hasDisability: z.boolean(),
    disabilityType: z.string().optional(),
    disabilityDescription: z.string().optional()
}).refine(data => !data.hasDisability || (data.disabilityType && data.disabilityType.length > 0), {
    message: "Please specify the type of disability if you checked Yes",
    path: ["disabilityType"]
});

interface DisabilityStepProps {
    initialData?: DisabilityDto;
    onNext: (data: DisabilityDto) => void;
    onBack: () => void;
    saving: boolean;
}

export default function DisabilityStep({ initialData, onNext, onBack, saving }: DisabilityStepProps) {
    const [data, setData] = useState<DisabilityDto>(
        initialData || {
            hasDisability: false,
            disabilityType: "",
            disabilityDescription: ""
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = () => {
        const result = schema.safeParse(data);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(Object.keys(fieldErrors).reduce((acc: Record<string, string>, key) => {
                const messages = fieldErrors[key as keyof typeof fieldErrors];
                if (messages && messages.length > 0) {
                    acc[key] = messages[0];
                }
                return acc;
            }, {}));
            toast.error("Please review the fields.");
            return;
        }
        onNext(data);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-6 bg-purple-50 border border-purple-100 rounded-3xl flex gap-4 items-start">
                <Accessibility className="text-purple-600 shrink-0" size={24} />
                <div>
                    <h4 className="font-bold text-purple-900 text-sm mb-1">Inclusivity Information</h4>
                    <p className="text-purple-800/80 text-xs leading-relaxed">
                        We are committed to inclusivity. Providing this information helps us ensure appropriate
                        accommodations are available for all participants.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest">
                        Do you have any disability?
                    </label>
                    <div className="flex gap-4">
                        <label className={`flex-1 p-4 border rounded-2xl cursor-pointer transition-all ${!data.hasDisability ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-white border-gray-200 text-gray-500'}`}>
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    checked={!data.hasDisability}
                                    onChange={() => setData({...data, hasDisability: false})}
                                    className="hidden"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 ${!data.hasDisability ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`} />
                                <span className="font-bold text-sm">No</span>
                            </div>
                        </label>
                        <label className={`flex-1 p-4 border rounded-2xl cursor-pointer transition-all ${data.hasDisability ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-white border-gray-200 text-gray-500'}`}>
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    checked={data.hasDisability}
                                    onChange={() => setData({...data, hasDisability: true})}
                                    className="hidden"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 ${data.hasDisability ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`} />
                                <span className="font-bold text-sm">Yes</span>
                            </div>
                        </label>
                    </div>
                </div>

                {data.hasDisability && (
                    <div className="space-y-6 animate-in slide-in-from-top-2 duration-300 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Type of Disability *</label>
                            <input
                                className={`w-full p-4 bg-white border ${errors.disabilityType ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none`}
                                placeholder="e.g. Visual Impairment, Hearing..."
                                value={data.disabilityType}
                                onChange={e => {
                                    setData({...data, disabilityType: e.target.value});
                                    setErrors({...errors, disabilityType: ""});
                                }}
                            />
                            {errors.disabilityType && <p className="text-xs text-red-500">{errors.disabilityType}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Accommodations Needed</label>
                            <textarea
                                rows={3}
                                className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
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
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-[2] py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <>Save & Continue <ArrowRight size={18} /></>}
                </button>
            </div>
        </div>
    );
}