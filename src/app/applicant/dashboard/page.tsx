"use client";

import {
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Bell,
  Award,
  Check,
  MoreHorizontal,
  Copy,
  Lock,
  AlertTriangle
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from 'date-fns';


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
  const [copied, setCopied] = useState(false);

  const today = new Date();
  const interviewDate = application?.interviewDate ? parseISO(application.interviewDate) : null;

  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // --- THEME CONFIGURATION ---
  const STEP_THEMES = [
    { name: 'Emerald', bg: 'bg-emerald-500', text: 'text-emerald-600', stroke: '#10b981' },
    { name: 'Blue',    bg: 'bg-blue-500',    text: 'text-blue-600',    stroke: '#3b82f6' },
    { name: 'Violet',  bg: 'bg-violet-500',  text: 'text-violet-600',  stroke: '#8b5cf6' },
    { name: 'Amber',   bg: 'bg-amber-500',   text: 'text-amber-600',   stroke: '#f59e0b' },
  ];

  // --- STEPS CONFIGURATION ---
  // Using the presence of objects in your JSON to determine completion
  const steps = [
    {
      label: "Personal Information",
      isComplete: !!application?.personalInfo,
      theme: STEP_THEMES[0]
    },
    {
      label: "Education & Experience",
      isComplete: !!application?.education,
      theme: STEP_THEMES[1]
    },
    {
      label: "Motivation",
      isComplete: !!application?.motivation,
      theme: STEP_THEMES[2]
    },
    {
      label: "Documents",
      isComplete: (application?.documents?.length || 0) > 0,
      theme: STEP_THEMES[3]
    },
    {
      label: "Emergency Contacts",
      isComplete: (application?.emergencyContacts?.length || 0) > 0,
      theme: STEP_THEMES[3]
    },
    {
      label: "Disability",
      isComplete: !!application?.disability,
      theme: STEP_THEMES[3]
    },
    {
      label: "Vulnerability",
      isComplete: !!application?.vulnerability,
      theme: STEP_THEMES[3]
    }
  ];

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/login");
          return;
        }

        await checkAuth();

        const [appData, notifsData] = await Promise.all([
          applicationService.getMyApplication(token),
          notificationService.getUnread(token)
        ]);

        setApplication(appData);
        setNotifications(notifsData);

        // Calculate Progress
        if (appData?.id) {
          try {
            const progressData = await applicationService.getProgress(appData.id, token);
            setProgress(progressData);
          } catch (e) {
            console.warn("Could not fetch progress, calculating locally", e);

            let completed = 0;
            if (appData.personalInfo) completed++;
            if (appData.education) completed++;
            if (appData.motivation) completed++;
            if (appData.documents?.length > 0) completed++;
            if (appData.emergencyContacts?.length > 0) completed++;
            if (appData.disability) completed++;
            if (appData.vulnerability) completed++;

            const totalSteps = 7;
            setProgress(Math.round((completed / totalSteps) * 100));
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

  // --- SVG MATH ---
  const size = 200;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = 3;
  const segmentLength = (circumference / steps.length) - gap;

  // Small circle for stats
  const miniRadius = 28;
  const miniCircumference = 2 * Math.PI * 28;
  const miniOffset = miniCircumference - (progress / 100) * miniCircumference;

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
        return { bg: "bg-red-100", text: "text-red-700", border: "border-red-500", icon: AlertTriangle };
      default:
        return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-500", icon: AlertCircle };
    }
  };

  const appStatus = application?.status || "PENDING";
  const statusColors = getStatusColor(appStatus);
  const StatusIcon = statusColors.icon;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "Good Late Night";
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const greeting = getGreeting();

  const handleContinueApplication = () => {
    let stepIndex = steps.findIndex(s => !s.isComplete);
    if (stepIndex === -1) stepIndex = 0;
    const stepNumber = stepIndex + 1;

    if (application?.id) {
      router.push(`/applicant/apply?step=${stepNumber}&id=${application.id}`);
    } else {
      router.push("/applicant/apply");
    }
  };

  const copyToClipboard = () => {
    if (application?.id) {
      navigator.clipboard.writeText(application.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isComplete = progress === 100;

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
        {/* Welcome, Hero Section */}
        <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-2xl shadow-xl p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-200 text-md font-medium tracking-wide uppercase">
                  {greeting}
                </span>
                <span className="text-2xl animate-wave">👋</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-3 capitalize text-white drop-shadow-sm">
                {user?.name || "Applicant"}
              </h2>

              <p className="text-green-100 mb-6 max-w-lg leading-relaxed opacity-90">
                Track your application progress and stay updated on your status.
                Your application is currently{" "}
                <span className={`font-bold px-2.5 py-1 rounded-md text-white backdrop-blur-sm shadow-sm inline-block mt-1 md:mt-0 ${appStatus === 'SYSTEM_REJECTED' ? 'bg-red-500/30' : 'bg-white/20'}`}>
                  {appStatus.replace(/_/g, " ")}
                </span>
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleContinueApplication}
                    className="bg-white text-green-700 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  {application ? "View Application" : "Start Application"}
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 hidden md:block">
              <div className="relative group">
                <div className="w-36 h-36 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/10">
                    <span className="text-4xl font-bold text-white drop-shadow-md">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  </div>
                </div>
                {/* Dynamic Status Icon Color */}
                <div className={`absolute -bottom-2 -right-2 rounded-full p-2.5 border-4 border-green-800 shadow-lg ${appStatus === 'SYSTEM_REJECTED' ? 'bg-red-500' : 'bg-green-500'}`}>
                  <StatusIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 1. Application ID Card */}
          <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-blue-100/80 rounded-xl text-blue-600 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <button
                  onClick={copyToClipboard}
                  className="text-xs flex items-center gap-1 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 px-2 py-1 rounded-lg transition-colors border border-gray-200"
                  title="Copy ID"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="relative z-10">
              <p className="text-gray-500 text-sm font-medium mb-1">Application ID</p>
              <h3 className="text-xl font-bold text-gray-800 tracking-tight font-mono">
                {application?.id ? (
                    <span className="flex items-baseline">
                      <span className="text-gray-300 text-lg">#</span>
                      {application.id.slice(0, 8)}...
                    </span>
                ) : "N/A"}
              </h3>
            </div>
          </div>

          {/* 2. Cohort Card */}
          <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-100/80 rounded-xl text-purple-600 shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <span className="flex h-3 w-3 relative"></span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Active Cohort</p>
              <h3 className="text-xl font-bold text-gray-800 truncate">
                {application?.cohortName || "Unassigned"}
              </h3>
              <p className="text-xs text-purple-600 mt-1 font-medium bg-purple-50 inline-block px-2 py-0.5 rounded-md">
                {new Date().getFullYear()} Session
              </p>
            </div>
          </div>

          {/* 3. Progress Card */}
          <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Completion</p>
              <h3 className="text-2xl font-bold text-gray-800">{progress}%</h3>
              <p className={`text-xs font-medium mt-1 ${progress === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                {progress === 100 ? "Ready to submit" : "Steps remaining"}
              </p>
            </div>

            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="32" cy="32" r={miniRadius}
                    stroke="#f3f4f6" strokeWidth="6" fill="transparent"
                />
                <circle
                    cx="32" cy="32" r={miniRadius}
                    stroke="currentColor" strokeWidth="6" fill="transparent"
                    strokeDasharray={miniCircumference}
                    strokeDashoffset={miniOffset}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-out ${
                        progress === 100 ? "text-green-500" : "text-orange-500"
                    }`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                {progress === 100 ? <Check className="w-4 h-4 text-green-600" /> : <MoreHorizontal className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* 4. Status Card */}
          <div className={`group rounded-2xl p-5 border shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden ${
              appStatus.includes('ACCEPTED') ? 'bg-green-50/50 border-green-100' :
                  appStatus.includes('REJECTED') ? 'bg-red-50/50 border-red-100' :
                      'bg-white border-gray-100'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div className={`${statusColors.bg} p-3 rounded-xl shadow-inner transition-colors`}>
                <StatusIcon className={`w-6 h-6 ${statusColors.text}`} />
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  statusColors.bg.replace('bg-', 'border-').replace('100', '200')
              } ${statusColors.text}`}>
                {appStatus.split('_')[0]}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-500 text-sm font-medium mb-1">Current Status</p>
              <h3 className={`text-lg font-bold capitalize ${statusColors.text} truncate`}>
                {appStatus.replace(/_/g, " ").toLowerCase()}
              </h3>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
              <div className={`h-full ${
                  appStatus === 'DRAFT' ? 'w-1/4' :
                      appStatus === 'SUBMITTED' ? 'w-2/4' :
                          appStatus === 'UNDER_REVIEW' ? 'w-3/4' :
                              'w-full'
              } ${statusColors.text.replace('text-', 'bg-')} opacity-20`} />
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Progress Chart & Steps */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Application Metrics
                  </h3>
                  <p className="text-sm text-gray-500">SheCanCODE Journey Statistics</p>
                </div>
                {!isComplete && (
                    <button
                        onClick={handleContinueApplication}
                        className="group flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-full text-sm font-semibold transition-all shadow-sm"
                    >
                      {application ? "Continue" : "Start"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
              </div>

              <div className="flex-1 flex flex-col items-center">

                {/* TOP: Segmented Wheel Chart */}
                <div className="py-6 flex justify-center w-full mb-6">
                  <div className="relative w-56 h-56">
                    <div className="absolute inset-0 rounded-full shadow-inner bg-gray-50/50"></div>

                    <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox={`0 0 ${size} ${size}`}>
                      {steps.map((step, index) => {
                        const rotation = (index * 360) / steps.length;
                        return (
                            <circle
                                key={index}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={step.isComplete ? step.theme.stroke : "#f3f4f6"}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${segmentLength} ${circumference}`}
                                strokeDashoffset={0}
                                strokeLinecap="round"
                                transform={`rotate(${rotation} ${center} ${center})`}
                                className="transition-all duration-1000 ease-out"
                                style={{
                                  opacity: step.isComplete ? 1 : 0.8
                                }}
                            />
                        );
                      })}
                    </svg>

                    {/* Center Stats */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total</span>
                      <div className="text-5xl font-extrabold text-gray-800 tracking-tight">
                        {progress}<span className="text-2xl text-gray-400">%</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${isComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {isComplete ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM: Detailed Breakdown Grid */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Detailed Breakdown</h4>
                    <span className="text-xs text-gray-500 font-mono">
                      {steps.filter(s => s.isComplete).length} / {steps.length} Steps
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {steps.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                item.isComplete
                                    ? "bg-gray-50 border-gray-100"
                                    : "bg-white border-dashed border-gray-200"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-8 rounded-full ${item.isComplete ? item.theme.bg : 'bg-gray-200'}`}></div>

                            <div className="flex flex-col">
                               <span className={`text-sm font-bold capitalize ${item.isComplete ? 'text-gray-800' : 'text-gray-500'}`}>
                                 {item.label}
                               </span>
                              <span className="text-[10px] text-gray-400 font-medium">Step {index + 1}</span>
                            </div>
                          </div>

                          {item.isComplete ? (
                              <CheckCircle className={`w-5 h-5 ${item.theme.text}`} />
                          ) : (
                              <div className="bg-gray-100 p-1 rounded-md">
                                <Lock className="w-3 h-3 text-gray-400" />
                              </div>
                          )}
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Messages & Updates */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-96 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
                <div className={`p-2 rounded-xl ${appStatus === 'SYSTEM_REJECTED' ? 'bg-red-100' : 'bg-green-100'}`}>
                  <Bell className={`w-5 h-5 ${appStatus === 'SYSTEM_REJECTED' ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Updates</h3>
                {notifications.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notifications.length}
                 </span>
                )}
              </div>

              <div className="space-y-3">

                {/* 1. PRIORITY: System Rejection Message */}
                {application?.status === 'SYSTEM_REJECTED' && (
                    <div className="bg-red-50 border-l-1 border-red-500 rounded-lg p-4 mb-3 animate-in slide-in-from-right fade-in duration-300">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <p className="text-sm font-bold text-red-900">Application Rejected</p>
                      </div>
                      <p className="text-xs text-red-700 font-medium mt-1">
                        {application.systemRejectionReason || "Reason not specified."}
                      </p>
                      <p className="text-[10px] text-red-400 mt-2 text-right">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                )}

                {/* 2. Normal Notifications */}
                {notifications.map((notif) => (
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
                ))}

                {/* 3. Fallback: Application Started (Only if no other critical status) */}
                {notifications.length === 0 && application?.status !== 'SYSTEM_REJECTED' && (
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
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 capitalize">
                    {format(today, 'MMMM yyyy')}
                  </h3>
                  {interviewDate && (
                      <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-md w-fit mt-1">
          Interview Scheduled
        </span>
                  )}
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-bold text-gray-400">
                      {day}
                    </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, dayIdx) => {
                  // Logic for Styles
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isDayToday = isToday(day);
                  const isInterview = interviewDate ? isSameDay(day, interviewDate) : false;

                  return (
                      <div
                          key={day.toString()}
                          className={`
            relative h-9 flex items-center justify-center rounded-lg text-sm transition-all
            ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
            ${isDayToday && !isInterview ? 'bg-green-100 text-green-700 font-bold border border-green-200' : ''}
            ${isInterview ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-200' : 'hover:bg-gray-50'}
          `}
                      >
                        {format(day, 'd')}

                        {/* Dot Indicators */}
                        <div className="absolute bottom-1 flex gap-0.5">
                          {/* Green dot for Today */}
                          {isDayToday && !isInterview && (
                              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                          )}
                          {/* White dot if Interview is selected */}
                          {isInterview && (
                              <div className="w-1 h-1 bg-white/70 rounded-full"></div>
                          )}
                        </div>
                      </div>
                  );
                })}
              </div>

              {/* Legend / Footer */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-500">Today</span>
                </div>
                {interviewDate && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span className="text-gray-500">Interview</span>
                    </div>
                )}
              </div>
            </div>
              </div>
            </div>
          </div>
  );
}