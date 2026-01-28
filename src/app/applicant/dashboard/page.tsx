"use client";

import { Calendar, ArrowRight, CheckCircle, Clock, XCircle, AlertCircle, TrendingUp, FileText, Bell, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, checkAuth } = useAuth();
  const [mounted, setMounted] = useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay();

  useEffect(() => {
    checkAuth();
    setMounted(true);
  }, [checkAuth]);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "ACCEPTED":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-500" };
      case "PENDING":
      case "UNDER_REVIEW":
        return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-500" };
      case "REJECTED":
        return { bg: "bg-red-100", text: "text-red-700", border: "border-red-500" };
      default:
        return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-500" };
    }
  };

  const statusColors = getStatusColor(user?.applicationStatus || "PENDING");

  const getProgressPercentage = () => {
    const step = user?.applicationStep || "/applicant/apply";
    if (step.includes("documents")) return 75;
    if (step.includes("review")) return 90;
    if (step.includes("complete")) return 100;
    return 25;
  };

  const progress = getProgressPercentage();
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-2xl shadow-xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-200 text-sm font-medium">Welcome back</span>
              <span className="text-2xl">👋</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 capitalize">
              {user?.name || "Applicant"}
            </h2>
            <p className="text-green-100 mb-6 max-w-lg">
              Track your application progress and stay updated on your status. 
              Your application is currently{" "}
              <span className={`font-semibold px-2 py-0.5 rounded ${statusColors.bg} ${statusColors.text}`}>
                {user?.applicationStatus?.replace(/_/g, " ") || "Under Review"}
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white text-green-700 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                <FileText className="w-5 h-5" />
                View Application
              </button>
              <button className="bg-green-600 border-2 border-white/30 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </button>
            </div>
          </div>
          
          <div className="flex-shrink-0 hidden md:block">
            <div className="relative">
              <div className="w-36 h-36 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-green-700">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">APP-2025-001</p>
          <p className="text-sm text-gray-500">Application ID</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Current</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{user?.cohort || "Spring 2025"}</p>
          <p className="text-sm text-gray-500">Cohort</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className={`text-xs font-medium ${statusColors.text} ${statusColors.bg} px-2 py-1 rounded-full`}>
              {progress}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800">Step {Math.ceil(progress / 25)}/4</p>
          <p className="text-sm text-gray-500">Application Stage</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={`${statusColors.bg} p-3 rounded-xl`}>
              <CheckCircle className={`w-6 h-6 ${statusColors.text}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${statusColors.text}`}>
            {user?.applicationStatus?.replace(/_/g, " ") || "Active"}
          </p>
          <p className="text-sm text-gray-500">Status</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Progress */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Application Progress</h3>
                <p className="text-sm text-gray-500">Your journey to SheCanCODE</p>
              </div>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Circular Progress */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="url(#gradient)" 
                    strokeWidth="10" 
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800">{progress}%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex-1 space-y-4 w-full">
                {[
                  { label: "Personal Information", progress: 100, color: "bg-green-500" },
                  { label: "Academic History", progress: 100, color: "bg-green-500" },
                  { label: "References", progress: 75, color: "bg-blue-500" },
                  { label: "Documents Upload", progress: 50, color: "bg-yellow-500" },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className="text-sm text-gray-500">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all group">
                <div className="bg-green-500 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-800">Upload Documents</span>
                <span className="text-xs text-gray-500">2 pending</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all group">
                <div className="bg-blue-500 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-800">Schedule Interview</span>
                <span className="text-xs text-gray-500">Available soon</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all group">
                <div className="bg-purple-500 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-800">View Updates</span>
                <span className="text-xs text-gray-500">3 new</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Messages & Updates */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-xl">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Updates</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-l-4 border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-900">Application Received</p>
                </div>
                <p className="text-xs text-green-700">Your application is under review</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-l-4 border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-900">Interview Schedule</p>
                </div>
                <p className="text-xs text-blue-700">Invitations sent after Jan 20</p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 border-l-4 border-yellow-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm font-semibold text-yellow-900">Action Required</p>
                </div>
                <p className="text-xs text-yellow-700">Upload missing documents</p>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{currentMonth} {currentYear}</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div key={i} className="p-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      i + 1 === today 
                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold shadow-md" 
                        : "text-gray-700 hover:bg-green-50"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm bg-gradient-to-r from-green-50 to-green-100/50 p-4 rounded-xl border border-green-100">
              <p className="font-semibold text-green-800 mb-1">📅 Important Date</p>
              <p className="text-green-700">Interview invitations: Jan 20, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
