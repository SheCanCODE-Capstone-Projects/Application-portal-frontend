// src/app/applicant/components/EducationStep.tsx
"use client";

import { useState } from "react";
import { GraduationCap, Briefcase, Clock, ArrowRight, ArrowLeft, Loader2, BookOpen } from "lucide-react";

export default function EducationStep({ onNext, onBack, saving }: any) {
  const [data, setData] = useState({
    highestEducationLevel: "BACHELOR",
    highestEducation: "",
    occupation: "",
    employmentStatus: "UNEMPLOYED",
    yearsExperience: 0
  });

  // Simple validation to ensure the required field is filled before allowing submission
  const canContinue = data.highestEducation.trim() !== "";

  return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Highest Education Level (Enum) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0f5d3f] flex items-center gap-2">
              <GraduationCap size={18} /> Highest Education Level *
            </label>
            <select
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={data.highestEducationLevel}
                onChange={e => setData({...data, highestEducationLevel: e.target.value})}
            >
              <option value="PRIMARY">Primary School</option>
              <option value="SECONDARY">Secondary School</option>
              <option value="HIGH_SCHOOL">High School</option>
              <option value="DIPLOMA">Diploma</option>
              <option value="BACHELOR">Bachelor's Degree</option>
              <option value="MASTER">Master's Degree</option>
              <option value="PHD">PHD</option>
            </select>
          </div>

          {/* Highest Education Detail (Required Text Field) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0f5d3f] flex items-center gap-2">
              <BookOpen size={18} /> Education Qualification *
            </label>
            <input
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="e.g. Bsc in Computer Science"
                value={data.highestEducation}
                onChange={e => setData({...data, highestEducation: e.target.value})}
            />
            {data.highestEducation === "" && (
                <p className="text-[10px] text-red-500 font-bold uppercase ml-1">Qualification detail is required</p>
            )}
          </div>

          {/* Current Occupation */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0f5d3f] flex items-center gap-2">
              <Briefcase size={18} /> Current Occupation
            </label>
            <input
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="e.g. Student, Software Developer"
                value={data.occupation}
                onChange={e => setData({...data, occupation: e.target.value})}
            />
          </div>

          {/* Years of Experience */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0f5d3f] flex items-center gap-2">
              <Clock size={18} /> Years of Experience
            </label>
            <input
                type="number"
                min="0"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={data.yearsExperience}
                onChange={e => setData({...data, yearsExperience: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-100">
          <button
              type="button"
              onClick={onBack}
              className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft size={18} /> Previous Step
          </button>
          <button
              type="button"
              onClick={() => onNext(data)}
              disabled={saving || !canContinue}
              className="flex-[2] py-4 bg-[#0f5d3f] hover:bg-[#0a4330] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
                <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" /> Saving...
              </span>
            ) : (
                <>Save & Continue <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </div>
  );
}