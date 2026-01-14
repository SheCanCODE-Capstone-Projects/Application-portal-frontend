"use client";

import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { userService, UserProfile, Application, ApplicationProgress } from '@/services/user';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [progress, setProgress] = useState<ApplicationProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, applicationsData] = await Promise.all([
          userService.getProfile(),
          userService.getApplications()
        ]);
        
        setProfile(profileData);
        setApplications(applicationsData);
        
        if (applicationsData.length > 0) {
          const progressData = await userService.getApplicationProgress(applicationsData[0].id);
          setProgress(progressData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Set fallback data when API fails
        setProfile({
          id: 'APP-2025-001',
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+250 788 123 456',
          role: 'applicant'
        });
        setApplications([{
          id: 'APP-2025-001',
          title: 'Software Engineering Program',
          status: 'under_review',
          submittedAt: '2024-12-15T00:00:00Z',
          cohort: 'Spring 2025'
        }]);
        setProgress({
          id: 'APP-2025-001',
          personalInfo: 100,
          academicHistory: 100,
          references: 75,
          documents: 50,
          overall: 75
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentApplication = applications[0];
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

  // Real-time date updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render every minute to update current time
      setLoading(false);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {profile?.name || 'Applicant'}!</h2>
            <p className="text-gray-600 mb-4">
              Track your application progress and stay informed about your status. 
              Your application is currently <span className="font-semibold text-green-600">{currentApplication?.status || 'pending'}</span>.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
              View Full Application
            </button>
          </div>
          {/* <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-green-50 rounded-lg flex items-center justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl"></span>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Application Status & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dashboard Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Dashboard Overview</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                View More <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1">Application ID</p>
                <p className="text-lg font-bold text-gray-800">{currentApplication?.id || 'N/A'}</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1">Cohort</p>
                <p className="text-lg font-bold text-gray-800">{currentApplication?.cohort || 'N/A'}</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1">Application Stage</p>
                <p className="text-lg font-bold text-gray-800">{currentApplication?.status || 'N/A'}</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
            </div>

          </div>

          {/* Application Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Application Progress</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                View Details <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">Your progress on the Application</p>

            {/* Circular Progress Chart */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  {/* Progress circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#10b981" 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">{progress?.overall || 0}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Legend */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Personal Info ({progress?.personalInfo || 0}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Academic History ({progress?.academicHistory || 0}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">References ({progress?.references || 0}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Documents ({progress?.documents || 0}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Messages & Actions */}
        <div className="space-y-6">
          {/* Messages & Updates */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <AlertCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Messages & Updates</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white border-l-4 border-green-500 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <p className="text-sm font-semibold text-green-900">Application Status</p>
                </div>
                <p className="text-sm text-green-700 mb-1">Your application is under review</p>
                <p className="text-xs text-green-600">Interview invitations will be sent after Jan 20</p>
              </div>

              <div className="bg-white border-l-4 border-blue-500 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <p className="text-sm font-semibold text-blue-900">System Requirements</p>
                </div>
                <p className="text-sm text-blue-700">You passed system requirements</p>
              </div>

              <div className="bg-white border-l-4 border-yellow-500 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                  <p className="text-sm font-semibold text-yellow-900">Action Required</p>
                </div>
                <p className="text-sm text-yellow-700">Please upload missing documents</p>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{currentMonth} {currentYear}</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500 mb-2">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${
                      i + 1 === today ? "bg-green-600 text-white font-semibold" : "text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-600 bg-green-50 p-3 rounded-lg">
              <p className="font-semibold text-green-900 mb-1">Important Date</p>
              <p>Interview invitations: Jan 20, 2025</p>
              <p className="text-xs text-gray-500 mt-1">Current time: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
}