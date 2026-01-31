// src/app/applicant/components/ReviewStep.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  User,
  GraduationCap,
  Heart,
  FileText,
  Phone,
  AlertCircle,
  ExternalLink,
  Accessibility,
  ShieldAlert
} from "lucide-react";
import { applicationService } from "@/services/application/application-service";
import { Application } from "@/types/application/application";
import { toast } from "sonner";

interface ReviewStepProps {
  onSubmit: () => void;
  onBack: () => void;
  saving: boolean;
  goToStep?: (step: number) => void;
}

export default function ReviewStep({ onSubmit, onBack, saving, goToStep }: ReviewStepProps) {
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState<Application | null>(null);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const data = await applicationService.getMyApplication(token);
        setAppData(data);
      } catch (error) {
        console.error("Failed to fetch application data", error);
        toast.error("Failed to load application details. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, []);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4" />
          <p className="text-gray-500 font-medium">Loading your application details...</p>
        </div>
    );
  }

  if (!appData) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Something went wrong</h3>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">We couldn&#39;t load your application data. Please try going back and saving your progress again.</p>
          <button onClick={onBack} className="text-emerald-600 font-bold hover:underline">
            Go Back
          </button>
        </div>
    );
  }

  const {
    personalInfo,
    education,
    motivation,
    documents,
    emergencyContacts,
    disability,
    vulnerability
  } = appData;

  const SectionHeader = ({ icon: Icon, title, step }: { icon: any, title: string, step?: number }) => (
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2 mt-8 first:mt-0">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Icon className="text-emerald-700 w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-800 text-lg">{title}</h4>
        </div>
        {goToStep && step && (
            <button
                onClick={() => goToStep(step)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full transition-colors"
            >
              Edit
            </button>
        )}
      </div>
  );

  return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Success / Intro Banner */}
        <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="text-emerald-600 w-6 h-6" />
              <h3 className="font-bold text-emerald-900 text-xl">Almost There!</h3>
            </div>
            <p className="text-emerald-800/80 text-sm leading-relaxed">
              Please review all the information below carefully. Once submitted, you won&#39;t be able to edit your application.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Personal Information */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <SectionHeader icon={User} title="Personal Information" step={1} />
            {personalInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Full Name</span>
                    <p className="font-medium text-gray-800">{personalInfo.fullName}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Email</span>
                    <p className="font-medium text-gray-800">{personalInfo.email}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Phone</span>
                    <p className="font-medium text-gray-800">{personalInfo.phone}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Gender</span>
                    <p className="font-medium text-gray-800 capitalize">{personalInfo.gender?.toLowerCase() || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Nationality</span>
                    <p className="font-medium text-gray-800">{personalInfo.nationality}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Marital Status</span>
                    <p className="font-medium text-gray-800">{personalInfo.maritalStatus || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Social Links</span>
                    <p className="font-medium text-gray-800 truncate">{personalInfo.socialLinks || 'N/A'}</p>
                  </div>
                  {personalInfo.additionalInformation && (
                      <div className="md:col-span-2">
                        <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Additional Information</span>
                        <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-xl">{personalInfo.additionalInformation}</p>
                      </div>
                  )}
                </div>
            ) : <p className="text-red-400 text-sm italic">Information missing</p>}
          </div>

          {/* 2. Education */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <SectionHeader icon={GraduationCap} title="Education & Experience" step={2} />
            {education ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Level</span>
                    <p className="font-medium text-gray-800">{education.highestEducationLevel?.replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Institution/Degree</span>
                    <p className="font-medium text-gray-800">{education.highestEducation}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Current Occupation</span>
                    <p className="font-medium text-gray-800">{education.occupation || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Employment Status</span>
                    <p className="font-medium text-gray-800">{education.employmentStatus || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Experience</span>
                    <p className="font-medium text-gray-800">{education.yearsExperience} Year(s)</p>
                  </div>
                </div>
            ) : <p className="text-red-400 text-sm italic">Information missing</p>}
          </div>

          {/* 3. Motivation */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <SectionHeader icon={Heart} title="Motivation" step={3} />
            {motivation ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Why do you want to join?</span>
                    <p className="font-medium text-gray-700 bg-gray-50 p-3 rounded-xl">{motivation.whyJoin}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Future Goals</span>
                    <p className="font-medium text-gray-700 bg-gray-50 p-3 rounded-xl">{motivation.futureGoals}</p>
                  </div>
                </div>
            ) : <p className="text-red-400 text-sm italic">Information missing</p>}
          </div>

          {/* 4. Documents */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <SectionHeader icon={FileText} title="Documents" step={4} />
            {documents && documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                          <FileText className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-semibold text-gray-800 capitalize truncate">
                            {doc.docType.replace(/_/g, " ").toLowerCase()}
                          </p>
                          <p className="text-xs text-gray-500">Uploaded</p>
                        </div>
                        {doc.fileUrl && (
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600">
                              <ExternalLink size={16} />
                            </a>
                        )}
                      </div>
                  ))}
                </div>
            ) : <p className="text-gray-400 text-sm italic">No documents uploaded</p>}
          </div>

          {/* 5. Disability */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <SectionHeader icon={Accessibility} title="Disability Information" step={5} />
            {disability ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Has Disability?</span>
                    <p className="font-medium text-gray-800">{disability.hasDisability ? "Yes" : "No"}</p>
                  </div>
                  {disability.hasDisability && (
                      <>
                        <div>
                          <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Type</span>
                          <p className="font-medium text-gray-800">{disability.disabilityType || 'N/A'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Accommodations Needed</span>
                          <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-xl">{disability.disabilityDescription || 'None specified'}</p>
                        </div>
                      </>
                  )}
                </div>
            ) : <p className="text-gray-400 text-sm italic">No information provided</p>}
          </div>

          {/* 6. Vulnerability */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <SectionHeader icon={ShieldAlert} title="Socioeconomic Information" step={6} />
            {vulnerability ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Household Income</span>
                    <p className="font-medium text-gray-800">{vulnerability.householdIncome?.replace(/_/g, " ") || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Childcare Needs?</span>
                    <p className="font-medium text-gray-800">{vulnerability.hasChildcareNeeds ? "Yes" : "No"}</p>
                  </div>
                  {vulnerability.description && (
                      <div className="md:col-span-2">
                        <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Description</span>
                        <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-xl">{vulnerability.description}</p>
                      </div>
                  )}
                </div>
            ) : <p className="text-gray-400 text-sm italic">No information provided</p>}
          </div>

          {/* 7. Emergency Contacts */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <SectionHeader icon={Phone} title="Emergency Contacts" step={7} />
            {emergencyContacts && emergencyContacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyContacts.map((contact, idx) => (
                      <div key={idx} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                        <p className="font-bold text-gray-800 text-sm">{contact.name}</p>
                        <p className="text-xs text-gray-500 mb-1">{contact.relationship}</p>
                        <p className="text-sm font-mono text-gray-600">{contact.phone}</p>
                      </div>
                  ))}
                </div>
            ) : <p className="text-gray-400 text-sm italic">No contacts added</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-0 bg-[#f8fafc]/80 backdrop-blur-md pb-4 border-t border-gray-200/50">
          <button
              onClick={onBack}
              className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
          >
            Previous Step
          </button>
          <button
              onClick={onSubmit}
              disabled={saving}
              className="flex-[2] py-4 bg-[#0f5d3f] hover:bg-[#0a4330] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
                <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" /> Submitting...
            </span>
            ) : (
                <>Submit Application <Send size={18} /></>
            )}
          </button>
        </div>
      </div>
  );
}