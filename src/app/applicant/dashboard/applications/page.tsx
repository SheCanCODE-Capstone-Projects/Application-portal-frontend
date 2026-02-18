"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, Upload, Eye, Edit, MessageSquare, Download, FileText, AlertTriangle, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { applicationService } from '@/services/application/application-service';
import { Application, ApplicationStatus } from '@/types/application/application';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function ApplicationsPage() {
  const { checkAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          await checkAuth();
          const data = await applicationService.getMyApplication(token);
          setApplication(data);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        toast.error("Failed to load application details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [checkAuth]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
    );
  }

  // If no application exists yet
  if (!application) {
    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Application Found</h2>
            <p className="text-gray-600 mb-6">You haven't started an application for the current cohort yet.</p>
            <button
                onClick={() => router.push('/applicant/apply')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Start Application
            </button>
          </div>
        </div>
    );
  }

  // --- Helpers for Display Logic ---

  // 1. Calculate Timeline Step Status
  const getTimelineStepStatus = (stepName: 'submitted' | 'review' | 'interview' | 'decision') => {
    const status = application.status;

    // Define the progression of statuses
    const isSubmitted = status !== ApplicationStatus.DRAFT;
    const isUnderReview = [
      ApplicationStatus.PENDING_REVIEW,
      ApplicationStatus.UNDER_REVIEW,
      ApplicationStatus.INTERVIEW_SCHEDULED,
      ApplicationStatus.ACCEPTED,
      ApplicationStatus.APPROVED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.SYSTEM_REJECTED
    ].includes(status);

    const isInterview = [
      ApplicationStatus.INTERVIEW_SCHEDULED,
      ApplicationStatus.ACCEPTED,
      ApplicationStatus.APPROVED,
      ApplicationStatus.REJECTED
    ].includes(status);

    const isDecision = [
      ApplicationStatus.ACCEPTED,
      ApplicationStatus.APPROVED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.SYSTEM_REJECTED
    ].includes(status);

    switch (stepName) {
      case 'submitted': return isSubmitted ? 'completed' : 'pending';
      case 'review': return isUnderReview ? (status === ApplicationStatus.UNDER_REVIEW ? 'current' : 'completed') : 'pending';
      case 'interview': return isInterview ? (status === ApplicationStatus.INTERVIEW_SCHEDULED ? 'current' : 'completed') : 'pending';
      case 'decision': return isDecision ? 'completed' : 'pending';
      default: return 'pending';
    }
  };

  const renderTimelineIcon = (state: 'completed' | 'current' | 'pending') => {
    if (state === 'completed') return <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><CheckCircle className="w-5 h-5 text-white" /></div>;
    if (state === 'current') return <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse"><Clock className="w-5 h-5 text-white" /></div>;
    return <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"><Clock className="w-5 h-5 text-gray-400" /></div>;
  };

  // 2. Document Checking
  // NOTE: Ensure these types match exactly what you save in DocumentsStep.tsx
  const REQUIRED_DOCS = [
    { label: "Passport Photo", type: "passport_photo" },
    { label: "ID Document", type: "id_document" },
    { label: "Degree/Certificate", type: "degree_certificate" },
    { label: "CV / Resume", type: "cv" }
  ];

  const getDocStatus = (type: string) => {
    const doc = application.documents?.find(d => d.docType === type);
    return doc ? { status: 'Uploaded', doc } : { status: 'Missing', doc: null };
  };

  const missingDocsCount = REQUIRED_DOCS.filter(d => !getDocStatus(d.type).doc).length;

  return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-8xl mx-auto">
          {/* Application Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Application Management</h1>
              {application.status === ApplicationStatus.DRAFT && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">
                    Draft - Not Submitted
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Application ID</p>
                <p className="text-lg font-bold text-gray-800 truncate" title={application.id}>
                  APP-{application.id.substring(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Program / Cohort</p>
                <p className="text-lg font-bold text-gray-800 truncate">
                  {application.cohortName || "N/A"}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Submission Date</p>
                <p className="text-lg font-bold text-gray-800">
                  {application.submittedAt ? format(new Date(application.submittedAt), 'MMM d, yyyy') : "Not Submitted"}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Current Status</p>
                <p className={`text-lg font-bold ${
                    application.status === 'APPROVED' ? 'text-green-600' :
                        application.status === 'REJECTED' ? 'text-red-600' : 'text-blue-600'
                } capitalize`}>
                  {application.status.replace(/_/g, " ").toLowerCase()}
                </p>
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

                  {/* 1. Submitted */}
                  <div className={`flex items-center ${getTimelineStepStatus('submitted') === 'pending' ? 'opacity-50' : ''}`}>
                    {renderTimelineIcon(getTimelineStepStatus('submitted'))}
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-semibold text-gray-800">Application Submitted</h4>
                      <p className="text-xs text-gray-600">
                        {application.submittedAt ? format(new Date(application.submittedAt), 'MMMM d, yyyy') : "Pending submission"}
                      </p>
                    </div>
                  </div>

                  {/* 2. Under Review */}
                  <div className={`flex items-center ${getTimelineStepStatus('review') === 'pending' ? 'opacity-50' : ''}`}>
                    {renderTimelineIcon(getTimelineStepStatus('review'))}
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-semibold text-gray-800">Under Review</h4>
                      <p className="text-xs text-gray-600">
                        {getTimelineStepStatus('review') === 'current' ? 'Currently being reviewed' : 'Pending review'}
                      </p>
                    </div>
                  </div>

                  {/* 3. Interview */}
                  <div className={`flex items-center ${getTimelineStepStatus('interview') === 'pending' ? 'opacity-50' : ''}`}>
                    {renderTimelineIcon(getTimelineStepStatus('interview'))}
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-semibold text-gray-800">Interview</h4>
                      <p className="text-xs text-gray-600">
                        {application.status === ApplicationStatus.INTERVIEW_SCHEDULED ? "Scheduled" : "Pending invitation"}
                      </p>
                    </div>
                  </div>

                  {/* 4. Final Decision */}
                  <div className={`flex items-center ${getTimelineStepStatus('decision') === 'pending' ? 'opacity-50' : ''}`}>
                    {renderTimelineIcon(getTimelineStepStatus('decision'))}
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-semibold text-gray-800">Final Decision</h4>
                      <p className="text-xs text-gray-600">
                        {application.status === 'APPROVED' || application.status === 'ACCEPTED' ? "Accepted" :
                            application.status === 'REJECTED' ? "Not Selected" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submitted Documents */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Documents</h3>
                <div className="space-y-3">

                  {REQUIRED_DOCS.map((reqDoc) => {
                    const { status, doc } = getDocStatus(reqDoc.type);
                    const isMissing = status === 'Missing';

                    return (
                        <div key={reqDoc.type} className={`flex items-center justify-between p-4 border rounded-lg ${isMissing ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                          <div className="flex items-center">
                            {isMissing ? (
                                <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                            ) : (
                                <FileText className="w-5 h-5 text-green-600 mr-3" />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{reqDoc.label}</p>
                              <p className={`text-xs ${isMissing ? 'text-red-600' : 'text-green-600'}`}>
                                {isMissing ? 'Missing' : 'Uploaded'}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {doc?.fileUrl && (
                                <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    title="View Document"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                            )}
                            {isMissing && application.status === ApplicationStatus.DRAFT && (
                                <button
                                    onClick={() => router.push('/applicant/apply?step=4')}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                                    title="Upload Now"
                                >
                                  <Upload className="w-4 h-4" />
                                </button>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Application Details Checklist */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Application Details</h3>
                  {application.status === ApplicationStatus.DRAFT && (
                      <button
                          onClick={() => router.push(`/applicant/apply?id=${application.id}`)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Application
                      </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Personal Details</h4>
                    <p className="text-xs text-gray-600">
                      {application.personalInfo ? "Information submitted" : "Not yet submitted"}
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Academic History</h4>
                    <p className="text-xs text-gray-600">
                      {application.education ?
                          `${application.education.highestEducationLevel.replace(/_/g, " ")} - ${application.education.highestEducation}`
                          : "Not yet submitted"}
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Documents</h4>
                    <p className="text-xs text-gray-600">
                      {application.documents?.length || 0} document(s) uploaded
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Actions Required (Dynamic based on missing docs) */}
              {missingDocsCount > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Actions Required</h3>
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                          <p className="text-sm font-semibold text-red-900">Missing Documents</p>
                        </div>
                        <p className="text-sm text-red-700 mb-2">You have {missingDocsCount} missing document(s).</p>
                        <p className="text-xs text-red-600">Please complete your application.</p>
                      </div>
                      <button
                          onClick={() => router.push('/applicant/apply?step=4')}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </button>
                    </div>
                  </div>
              )}

              {/* Communication & Updates */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Communication & Updates</h3>
                <div className="space-y-3">
                  {application.status !== ApplicationStatus.DRAFT && (
                      <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <p className="text-sm font-semibold text-green-900">Status Update</p>
                        </div>
                        <p className="text-sm text-green-700 mb-1">
                          Your application is currently {application.status.replace(/_/g, " ").toLowerCase()}.
                        </p>
                      </div>
                  )}

                  {application.isSystemRejected && (
                      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <XCircle className="w-4 h-4 text-red-600 mr-2" />
                          <p className="text-sm font-semibold text-red-900">System Notification</p>
                        </div>
                        <p className="text-sm text-red-700 mb-1">
                          {application.systemRejectionReason || "Application did not meet criteria."}
                        </p>
                      </div>
                  )}

                  {application.status === ApplicationStatus.DRAFT && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <MessageSquare className="w-4 h-4 text-blue-600 mr-2" />
                          <p className="text-sm font-semibold text-blue-900">Reminder</p>
                        </div>
                        <p className="text-sm text-blue-700 mb-1">Please submit your application before the deadline.</p>
                      </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                      disabled
                      className="w-full bg-blue-50 text-blue-400 cursor-not-allowed px-4 py-2 rounded-lg flex items-center justify-center font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}