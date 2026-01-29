"use client";

import { useState } from "react";
import { MessageSquare, Target, BookOpen, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

export default function MotivationStep({ onNext, onBack, saving }: any) {
    const [data, setData] = useState({
        whyJoin: "",
        futureGoals: "",
        preferredCourse: ""
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#0f5d3f] flex items-center gap-2">
                        <MessageSquare size={18} /> Why do you want to join this program? *
                    </label>
                    <textarea
                        rows={4}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                        placeholder="Tell us about your motivation..."
                        onChange={e => setData({...data, whyJoin: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#0f5d3f] flex items-center gap-2">
                        <Target size={18} /> What are your future career goals? *
                    </label>
                    <textarea
                        rows={4}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                        placeholder="Where do you see yourself in 3 years?"
                        onChange={e => setData({...data, futureGoals: e.target.value})}
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button onClick={onBack} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all">
                    <ArrowLeft size={18} /> Previous Step
                </button>
                <button
                    onClick={() => onNext(data)}
                    disabled={saving || !data.whyJoin}
                    className="flex-[2] py-4 bg-[#0f5d3f] hover:bg-[#0a4330] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <>Save & Continue <ArrowRight size={18} /></>}
                </button>
            </div>
        </div>
    );
}