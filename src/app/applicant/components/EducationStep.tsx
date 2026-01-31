"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Briefcase, Clock, ArrowRight, ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { EducationDto } from "@/types/application/application";

const educationSchema = z.object({
  highestEducationLevel: z.string().min(1, "Please select an education level"),
  highestEducation: z.string().min(3, "Please specify your qualification"),
  occupation: z.string().optional(),
  yearsExperience: z.number().min(0, "Experience cannot be negative"),
});

export default function EducationStep({ initialData, onNext, onBack, saving }: any) {
  const [data, setData] = useState<EducationDto>({
    highestEducationLevel: "BACHELOR",
    highestEducation: "",
    occupation: "",
    employmentStatus: "UNEMPLOYED",
    yearsExperience: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleSubmit = () => {
    const result = educationSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: any = result.error.flatten().fieldErrors;
      setErrors(Object.keys(fieldErrors).reduce((acc: any, key) => {
        acc[key] = fieldErrors[key][0];
        return acc;
      }, {}));
      toast.error("Please fill in required fields.");
      return;
    }
    onNext(data);
  };

  return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0f5d3f] flex items-center gap-2">
              <GraduationCap size={18} /> Highest Education Level *
            </label>
            <select
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={data.highestEducationLevel}
                onChange={e => setData({...data, highestEducationLevel: e.target.value as any})}
            >
              <option value="PRIMARY">Primary School</option>
              <option value="SECONDARY">Secondary School</option>
              <option value="HIGH_SCHOOL">High School</option>
              <option value="DIPLOMA">Diploma</option>
              <option value="BACHELOR">Bachelor&#39;s Degree</option>
              <option value="MASTER">Master&#39;s Degree</option>
              <option value="PHD">PHD</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0f5d3f] flex items-center gap-2">
              <BookOpen size={18} /> Education Qualification *
            </label>
            <input
                className={`w-full p-4 bg-gray-50 border ${errors.highestEducation ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
                placeholder="e.g. Bsc in Computer Science"
                value={data.highestEducation}
                onChange={e => {
                  setData({...data, highestEducation: e.target.value});
                  setErrors({...errors, highestEducation: ""});
                }}
            />
            {errors.highestEducation && <p className="text-xs text-red-500 font-bold">{errors.highestEducation}</p>}
          </div>

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
              onClick={handleSubmit}
              disabled={saving}
              className="flex-[2] py-4 bg-[#0f5d3f] hover:bg-[#0a4330] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
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