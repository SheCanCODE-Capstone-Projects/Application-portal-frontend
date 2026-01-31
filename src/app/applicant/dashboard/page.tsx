"use client";

import { Calendar, ArrowRight, CheckCircle, Clock, XCircle, AlertCircle, TrendingUp, FileText, Bell, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { applicationService } from "@/services/application/application-service";
import { notificationService, Notification } from "@/services/notification/notification-service";
import { Application } from "@/types/application/application";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [progress, setProgress] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Date calculations
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay();

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/login");
          return;
        }

        await checkAuth();

        // Parallel fetch for application data and notifications
        const [appData, notifsData] = await Promise.all([
          applicationService.getMyApplication(token),
          notificationService.getUnread(token)
        ]);

        setApplication(appData);
        setNotifications(notifsData);

        // If application exists, fetch exact progress percentage
        if (appData?.id) {
          try {
            const progressData = await applicationService.getProgress(appData.id, token);
            setProgress(progressData);
          } catch (e) {
            console.warn("Could not fetch progress", e);
            // Fallback progress calculation if API fails
            let calculatedProgress = 0;
            if (appData.personalInfo) calculatedProgress += 25;
            if (appData.education) calculatedProgress += 25;
            if (appData.motivation) calculatedProgress += 25;
            if (appData.documents && appData.documents.length > 0) calculatedProgress += 25;
            setProgress(calculatedProgress);
          }
        }
      } catch (error) {
        console.error("Dashboard data fetch failed:", error);
        toast.error("Failed to load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
        setMounted(true);
      }
    };

    initDashboard();
  }, [checkAuth, router]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "APPROVED":
      case "ACCEPTED":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-500", icon: CheckCircle };
      case "PENDING":
      case "PENDING_REVIEW":
      case "UNDER_REVIEW":
      case "SUBMITTED":
        return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-500", icon: Clock };
      case "REJECTED":
      case "SYSTEM_REJECTED":
        return { bg: "bg-red-100", text: "text-red-700", border: "border-red-500", icon: XCircle };
      default:
        return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-500", icon: AlertCircle };
    }
  };

  const appStatus = application?.status || "PENDING";
  const statusColors = getStatusColor(appStatus);
  const StatusIcon = statusColors.icon;

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Dynamic steps based on actual data presence
  const steps = [
    {
      label: "Personal Information",
      isComplete: !!application?.personalInfo,
      color: "bg-green-500"
    },
    {
      label: "Education & Experience",
      isComplete: !!application?.education,
      color: "bg-green-500"
    },
    {
      label: "Motivation",
      isComplete: !!application?.motivation,
      color: "bg-blue-500"
    },
    {
      label: "Documents",
      isComplete: (application?.documents?.length || 0) > 0,
      color: "bg-yellow-500"
    },
  ];

  const handleContinueApplication = () => {
    if (application?.id) {
      // Determine the next logical step
      let step = 1;
      if (!application.personalInfo) step = 1;
      else if (!application.education) step = 2;
      else if (!application.motivation) step = 3;
      else if (!application.documents || application.documents.length === 0) step = 4;
      else if (!application.emergencyContacts || application.emergencyContacts.length === 0) step = 5;
      else step = 6; // Review

      router.push(`/applicant/apply?step=${step}&id=${application.id}`);
    } else {
      router.push("/applicant/apply");
    }
  };

  if (!mounted || loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
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
                <span className={`font-semibold px-2 py-0.5 rounded bg-white/20 text-white`}>
                {appStatus.replace(/_/g, " ")}
              </span>
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleContinueApplication}
                    className="bg-white text-green-700 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  {application ? "View Application" : "Start Application"}
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
                  <StatusIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Application ID Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-lg font-bold text-gray-800 truncate" title={application?.id}>
              {application?.id ? `...${application.id.slice(-8)}` : "N/A"}
            </p>
            <p className="text-sm text-gray-500">Application ID</p>
          </div>

          {/* Cohort Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Current</span>
            </div>
            <p className="text-lg font-bold text-gray-800 truncate">
              {application?.cohortName || "No Cohort"}
            </p>
            <p className="text-sm text-gray-500">Cohort</p>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className={`text-xs font-medium ${statusColors.text} ${statusColors.bg} px-2 py-1 rounded-full`}>
              {progress}%
            </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {progress === 100 ? "Complete" : "In Progress"}
            </p>
            <p className="text-sm text-gray-500">Completion</p>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`${statusColors.bg} p-3 rounded-xl`}>
                <StatusIcon className={`w-6 h-6 ${statusColors.text}`} />
              </div>
            </div>
            <p className={`text-lg font-bold ${statusColors.text} truncate`}>
              {appStatus.replace(/_/g, " ")}
            </p>
            <p className="text-sm text-gray-500">Current Status</p>
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
                <button
                    onClick={handleContinueApplication}
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {application ? "Continue" : "Start"} <ArrowRight className="w-4 h-4" />
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
                  {steps.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          <span className="text-sm text-gray-500">
                        {item.isComplete ? "Completed" : "Pending"}
                      </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                              className={`${item.isComplete ? item.color : "bg-gray-200"} h-2 rounded-full transition-all duration-500`}
                              style={{ width: item.isComplete ? "100%" : "5%" }}
                          ></div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions - Dynamically linked */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                    onClick={() => router.push(`/applicant/apply?step=4&id=${application?.id}`)}
                    className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all group"
                    disabled={!application}
                >
                  <div className="bg-green-500 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">Upload Documents</span>
                  <span className="text-xs text-gray-500">
                    {application?.documents?.length || 0} uploaded
                </span>
                </button>

                <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all group opacity-50 cursor-not-allowed">
                  <div className="bg-blue-500 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">Schedule Interview</span>
                  <span className="text-xs text-gray-500">Coming soon</span>
                </button>

                <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all group">
                  <div className="bg-purple-500 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">View Updates</span>
                  <span className="text-xs text-gray-500">{notifications.length} Unread</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Messages & Updates - Real Notifications */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-96 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
                <div className="bg-green-100 p-2 rounded-xl">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Updates</h3>
                {notifications.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notifications.length}
                 </span>
                )}
              </div>

              <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No new notifications</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif.id} className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-l-4 border-blue-500 rounded-lg p-4 transition-all hover:bg-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Bell className="w-4 h-4 text-blue-600" />
                            <p className="text-sm font-semibold text-blue-900">{notif.title}</p>
                          </div>
                          <p className="text-xs text-blue-700">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-2 text-right">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                    ))
                )}

                {/* Default Welcome Message if user just started */}
                {notifications.length === 0 && application && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-l-4 border-green-500 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-semibold text-green-900">Application Started</p>
                      </div>
                      <p className="text-xs text-green-700">
                        Your application for {application.cohortName} has been initialized.
                      </p>
                    </div>
                )}
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
            </div>
          </div>
        </div>
      </div>
  );
}