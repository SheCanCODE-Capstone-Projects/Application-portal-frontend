'use client';

import { CheckCircle, Clock, Upload, Eye, Edit, MessageSquare, Download, FileText, AlertTriangle } from 'lucide-react';

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Application Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Application Management</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Application ID</p>
              <p className="text-lg font-bold text-gray-800">APP-2025-001</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Program Name</p>
              <p className="text-lg font-bold text-gray-800">Advanced Frontend</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Submission Date</p>
              <p className="text-lg font-bold text-gray-800">Nov 15, 2025</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Current Status</p>
              <p className="text-lg font-bold text-blue-600">Under Review</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Application Timeline</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-semibold text-gray-800">Application Submitted</h4>
                    <p className="text-xs text-gray-600">November 15, 2025</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-semibold text-gray-800">Document Verification</h4>
                    <p className="text-xs text-gray-600">December 18, 2025</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-semibold text-gray-800">Under Review</h4>
                    <p className="text-xs text-gray-600">In Progress</p>
                  </div>
                </div>
                <div className="flex items-center opacity-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-semibold text-gray-800">Interview</h4>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                </div>
                <div className="flex items-center opacity-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-semibold text-gray-800">Final Decision</h4>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submitted Documents */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Submitted Documents</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">National ID</p>
                      <p className="text-xs text-green-600">Approved</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Academic Certificates</p>
                      <p className="text-xs text-green-600">Approved</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Transcript</p>
                      <p className="text-xs text-yellow-600">Under Review</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">CV</p>
                      <p className="text-xs text-red-600">Missing</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Application Details</h3>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Application
                </button>
              </div>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Personal Details</h4>
                  <p className="text-xs text-gray-600">Complete profile information submitted</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Academic History</h4>
                  <p className="text-xs text-gray-600">Bachelor's in Computer Science - University of Rwanda</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Documents</h4>
                  <p className="text-xs text-gray-600">Submitted all the Documents</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Actions Required */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Actions Required</h3>
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <p className="text-sm font-semibold text-red-900">Missing Document</p>
                  </div>
                  <p className="text-sm text-red-700 mb-2">Please upload your CV</p>
                  <p className="text-xs text-red-600">Deadline: January 15, 2025</p>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </button>
              </div>
            </div>

            {/* Communication & Updates */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Communication & Updates</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600 mr-2" />
                    <p className="text-sm font-semibold text-blue-900">Admin Message</p>
                  </div>
                  <p className="text-sm text-blue-700 mb-1">Your application is progressing well</p>
                  <p className="text-xs text-blue-600">2 days ago</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <p className="text-sm font-semibold text-green-900">Status Update</p>
                  </div>
                  <p className="text-sm text-green-700 mb-1">Documents verified successfully</p>
                  <p className="text-xs text-green-600">5 days ago</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download Application PDF
                </button>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Print Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}