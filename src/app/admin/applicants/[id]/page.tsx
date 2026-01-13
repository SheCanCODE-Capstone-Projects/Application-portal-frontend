// src/app/admin/applicants/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import api from '@/lib/axios';
import { useApplications } from '@/contexts/AdminApplicationContext';
import { toast } from 'react-hot-toast';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  status: string;
  program: string;
  cohort: string;
  progress: number;
  gender: string;
  education?: string;
  experience?: string;
  submittedAt: string;
  notes?: string;
}

export default function ApplicantDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { acceptApplication, rejectApplication } = useApplications();

  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch single applicant
  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/applications/${id}`);
        setApplicant(res.data);
      } catch (err) {
        setError(true);
        toast.error('Failed to load applicant details');
      } finally {
        setLoading(false);
      }   
    };

    if (id) fetchApplicant();
  }, [id]);

  const handleAccept = async () => {
    if (!applicant) return;
    try {
      await acceptApplication(applicant.id);
      setApplicant({ ...applicant, status: 'Accepted' });
      toast.success('Applicant accepted successfully');
    } catch (err) {
      // Error already handled by interceptor
    }
  };

  const handleReject = async () => {
    if (!applicant) return;
    if (!confirm('Are you sure you want to reject this applicant?')) return;

    try {
      await rejectApplication(applicant.id);
      setApplicant({ ...applicant, status: 'Rejected' });
      toast.success('Applicant rejected');
    } catch (err) {
      // Handled globally
    }
  };

  const handleScheduleInterview = () => {
    toast('Interview scheduling coming soon!', { icon: '⏰' });
    // You can later open a modal with date/time picker
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading applicant details...</p>
        </div>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center py-12">
        <p className="text-red-600">Applicant not found or failed to load.</p>
        <Link href="/admin/dashboard" className="mt-4 inline-block text-orange-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const statusColor =
    applicant.status.trim() === 'Accepted'
      ? 'bg-green-100 text-green-800'
      : applicant.status.trim() === 'Pending'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800';

  const initials = applicant.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Back Button */}
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{applicant.name}</h1>
              <p className="text-gray-600">{applicant.email} • {applicant.phone}</p>
              <span className={`mt-2 inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                {applicant.status.trim()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Application Date</p>
            <p className="font-medium text-black">
              {new Date(applicant.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Application Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-600">Program</dt>
              <dd className="font-medium text-gray-900">{applicant.program}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Cohort</dt>
              <dd className="font-medium text-orange-600">{applicant.cohort}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Progress</dt>
              <dd className="font-medium text-gray-900">{applicant.progress}%</dd>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div
                className="bg-orange-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${applicant.progress}%` }}
              />
            </div>
          </dl>
        </div>

        {/* Background */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Background</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-600">Gender</dt>
              <dd className="font-medium text-gray-900">{applicant.gender}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Education</dt>
              <dd className="font-medium text-gray-900">{applicant.education || 'Not provided'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Experience</dt>
              <dd className="font-medium text-gray-700">{applicant.experience || 'Not provided'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Admin Actions & Notes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Admin Actions</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleAccept}
            disabled={applicant.status.trim() === 'Accepted'}
            className={`px-5 py-2.5 rounded-md font-medium transition ${
              applicant.status.trim() === 'Accepted'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Accept Applicant
          </button>

          <button
            onClick={handleReject}
            disabled={applicant.status.trim() === 'Rejected'}
            className={`px-5 py-2.5 rounded-md font-medium transition ${
              applicant.status.trim() === 'Rejected'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Reject Applicant
          </button>

          <button
            onClick={handleScheduleInterview}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
          >
            Schedule Interview
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes</label>
          <textarea
            rows={5}
            className="w-full text-gray-700 border border-gray-300 rounded-md px-4 py-3 focus:ring-orange-500 focus:border-orange-500 resize-none"
            placeholder="Add any internal comments or notes about this applicant..."
            defaultValue={applicant.notes || ''}
            readOnly // Make editable later with save button if needed
          />
        </div>
      </div>
    </div>
  );
}