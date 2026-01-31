"use client";

import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Globe, Shield, Edit, Save, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { applicationService } from '@/services/application/application-service';
import { Application } from '@/types/application/application';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, userProfile, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          // 1. Ensure Auth Context is fresh
          await checkAuth();

          // 2. Fetch Application Data (contains detailed personal info)
          const appData = await applicationService.getMyApplication(token);
          setApplication(appData);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        toast.error("Could not load full profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [checkAuth]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
    );
  }

  // Fallback values if data is missing
  const personalInfo = application?.personalInfo;
  const displayName = personalInfo?.fullName || user?.name || "N/A";
  const displayEmail = personalInfo?.email || user?.email || "N/A";
  const displayPhone = personalInfo?.phone || "Not provided";
  const applicantId = application?.id ? `APP-${application.id.substring(0, 8).toUpperCase()}` : "N/A";
  const status = application?.status || "NO_APPLICATION";
  const cohortName = application?.cohortName || user?.cohort || "N/A";

  return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-3xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-800">{displayName}</h1>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                  <span>Applicant ID:</span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm">{applicantId}</span>
                </p>
                <div className="flex items-center justify-center md:justify-start mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${status === 'APPROVED' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {status.replace(/_/g, " ")}
                </span>
                </div>
              </div>
              {/* Edit Profile Button (Placeholder for future functionality) */}
              {/* <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button> */}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">

              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" /> Personal Information
                </h3>

                {personalInfo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                        <p className="text-lg font-semibold text-gray-800">{personalInfo.fullName}</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Gender</p>
                        <p className="text-lg font-semibold text-gray-800 capitalize">
                          {personalInfo.gender ? personalInfo.gender.toLowerCase() : "N/A"}
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Nationality</p>
                        <p className="text-lg font-semibold text-gray-800">{personalInfo.nationality || "N/A"}</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Marital Status</p>
                        <p className="text-lg font-semibold text-gray-800">{personalInfo.maritalStatus || "N/A"}</p>
                      </div>
                    </div>
                ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <p>Personal information has not been submitted yet.</p>
                    </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                    <Mail className="w-5 h-5 text-green-600 mr-3" />
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="text-sm font-semibold text-gray-800 truncate" title={displayEmail}>{displayEmail}</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                    <Phone className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-800">{displayPhone}</p>
                    </div>
                  </div>

                  {/* Note: Address and Alt Phone are not currently in the PersonalInfoDto,
                    showing defaults or placeholders if you plan to add them later */}
                  {/* <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                  <MapPin className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-semibold text-gray-800">N/A</p>
                  </div>
                </div>
                */}
                </div>
              </div>

              {/* Academic Program Info */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" /> Program Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Target Cohort</p>
                    <p className="text-lg font-semibold text-gray-800">{cohortName}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Application Date</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {application?.createdAt ? format(new Date(application.createdAt), 'MMMM d, yyyy') : "N/A"}
                    </p>
                  </div>
                  {application?.motivation && (
                      <div className="border border-gray-200 rounded-lg p-4 md:col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Preferred Course</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {application.motivation.preferredCourse || "General Software Engineering"}
                        </p>
                      </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Account Settings */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-400" /> Account
                </h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <p className="text-sm font-semibold text-gray-800">{user?.role || "APPLICANT"}</p>
                  </div>

                  {/* Visual indicators for Account status (Mocked for UI consistency) */}
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Email Verified</p>
                      <p className="text-sm font-semibold text-green-600">Verified</p>
                    </div>
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2">System Preferences</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Notifications</span>
                        <span className="text-green-600 font-medium">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
                <div className="space-y-3">
                  {/* Note: Backend currently doesn't support direct password change via this UI,
                  buttons are placeholders or can redirect to specific auth routes.
                */}
                  <button
                      disabled
                      className="w-full bg-gray-100 text-gray-400 cursor-not-allowed px-4 py-3 rounded-lg flex items-center justify-center font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                      onClick={() => toast.info("Please contact support to reset password or use the Forgot Password flow.")}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors font-medium"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}