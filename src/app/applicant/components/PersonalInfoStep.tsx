// src/app/applicant/components/PersonalInfoStep.tsx
"use client";

import { Loader2, ArrowRight, User, Mail, Phone, Globe, Heart, Link as LinkIcon, Info } from "lucide-react";
import { useState } from "react";
import { PersonalInfoDto } from "@/types/application/application";

interface Props {
  onNext: (data: PersonalInfoDto) => void;
  saving: boolean;
}

export default function PersonalInfoStep({ onNext, saving }: Props) {
  const [data, setData] = useState<PersonalInfoDto>({
    fullName: "",
    email: "",
    phone: "",
    gender: "MALE",
    nationality: "Rwandan",
    maritalStatus: "SINGLE",
    socialLinks: "",
    additionalInformation: ""
  });

  const isFormValid = data.fullName && data.email && data.phone && data.nationality;

  return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <User size={16} /> Full Name *
            </label>
            <input
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="John Doe"
                value={data.fullName}
                onChange={e => setData({...data, fullName: e.target.value})}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <Mail size={16} /> Email Address *
            </label>
            <input
                type="email"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="john@example.com"
                value={data.email}
                onChange={e => setData({...data, email: e.target.value})}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <Phone size={16} /> Phone Number *
            </label>
            <input
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="+250 788 000 000"
                value={data.phone}
                onChange={e => setData({...data, phone: e.target.value})}
            />
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <Globe size={16} /> Nationality *
            </label>
            <input
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Rwandan"
                value={data.nationality}
                onChange={e => setData({...data, nationality: e.target.value})}
            />
          </div>

          {/* Gender - Enumerated for Backend Compatibility */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <User size={16} /> Gender
            </label>
            <select
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                value={data.gender}
                onChange={e => setData({...data, gender: e.target.value as any})}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <Heart size={16} /> Marital Status
            </label>
            <select
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                value={data.maritalStatus}
                onChange={e => setData({...data, maritalStatus: e.target.value})}
            >
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
            </select>
          </div>

          {/* Social Links */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <LinkIcon size={16} /> Social Media Links (LinkedIn/GitHub)
            </label>
            <input
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="https://linkedin.com/in/..."
                value={data.socialLinks}
                onChange={e => setData({...data, socialLinks: e.target.value})}
            />
          </div>

          {/* Additional Information */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <Info size={16} /> Additional Information
            </label>
            <textarea
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                placeholder="Anything else we should know?"
                value={data.additionalInformation}
                onChange={e => setData({...data, additionalInformation: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
              onClick={() => onNext(data)}
              disabled={saving || !isFormValid}
              className="w-full md:w-auto px-10 py-4 bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
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