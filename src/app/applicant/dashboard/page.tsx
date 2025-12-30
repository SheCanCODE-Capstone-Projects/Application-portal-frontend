"use client";

import { Calendar, ArrowRight, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, Applicant!</h2>
            <p className="text-gray-600 mb-4">
              Track your application progress and stay informed about your status. 
              Your application is currently <span className="font-semibold text-green-600">under review</span>.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
              View Full Application
            </button>
          </div>
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-green-50 rounded-lg flex items-center justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">📋</span>
              </div>
            </div>
          </div>
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
                <p className="text-lg font-bold text-gray-800">APP-2025-001</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1">Cohort</p>
                <p className="text-lg font-bold text-gray-800">Spring 2025</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1">Application Stage</p>
                <p className="text-lg font-bold text-gray-800">Under Review</p>
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
            <p className="text-sm text-gray-600 mb-4">Your progress on the Application</p>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800">Personal Information</span>
                  <span className="text-sm text-gray-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800">Academic History</span>
                  <span className="text-sm text-gray-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800">References and Occupation</span>
                  <span className="text-sm text-gray-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "75" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800">Documents Upload</span>
                  <span className="text-sm text-gray-600">50%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "50%" }}></div>
                </div>
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
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <p className="text-sm font-semibold text-green-900">Application Status</p>
                </div>
                <p className="text-sm text-green-700 mb-1">Your application is under review</p>
                <p className="text-xs text-green-600">Interview invitations will be sent after Jan 20</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <p className="text-sm font-semibold text-blue-900">System Requirements</p>
                </div>
                <p className="text-sm text-blue-700">You passed system requirements</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
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
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}