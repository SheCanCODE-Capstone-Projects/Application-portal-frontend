// src/app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useApplications } from '@/contexts/AdminApplicationContext';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const { applications, loading, fetchApplications } = useApplications();

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Sort state (same as your original)
  const [sortOpen, setSortOpen] = useState(false);
  const sortOptions = [
    { value: 'name-asc', label: 'Name: A → Z' },
    { value: 'name-desc', label: 'Name: Z → A' },
    { value: 'date-desc', label: 'Date: Newest' },
    { value: 'date-asc', label: 'Date: Oldest' },
    { value: 'status-pending', label: 'Status: Pending' },
    { value: 'status-accepted', label: 'Status: Accepted' },
    { value: 'status-rejected', label: 'Status: Rejected' },
  ];
  const [sortOption, setSortOption] = useState(sortOptions[2]); // Default: Date Newest

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.sort-dropdown')) {
        setSortOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Filter + Sort applications
  const filteredAndSortedApplicants = useMemo(() => {
    let filtered = applications;

    // Client-side search by name or ID
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = applications.filter(
        (app) =>
          app.name.toLowerCase().includes(lowerSearch) ||
          app.id.toLowerCase().includes(lowerSearch)
      );
    }

    // Sorting
    return [...filtered].sort((a, b) => {
      switch (sortOption.value) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'status-pending':
          return (a.status.trim() === 'Pending' ? 0 : 1) - (b.status.trim() === 'Pending' ? 0 : 1);
        case 'status-accepted':
          return (a.status.trim() === 'Accepted' ? 0 : 1) - (b.status.trim() === 'Accepted' ? 0 : 1);
        case 'status-rejected':
          return (a.status.trim() === 'Rejected' ? 0 : 1) - (b.status.trim() === 'Rejected' ? 0 : 1);
        default:
          return 0;
      }
    });
  }, [applications, searchTerm, sortOption]);

  // Calculate real stats
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status.trim() === 'Pending').length;
    const accepted = applications.filter(a => a.status.trim() === 'Accepted').length;
    const rejected = applications.filter(a => a.status.trim() === 'Rejected').length;

    // New this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = applications.filter(a => new Date(a.date) > weekAgo).length;

    return { total, pending, accepted, rejected, newThisWeek };
  }, [applications]);

  // CSV Export with real filtered data
  const handleDownloadCSV = () => {
    const headers = ['Student ID', 'Date', 'Name', 'Status'];
    const rows = filteredAndSortedApplicants.map(app =>
      `"${app.id}","${app.date}","${app.name}","${app.status}"`
    );
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `applicants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>

      {/* Stats Cards - Now Dynamic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
          <h3 className="text-gray-500 text-sm">Total Applicants</h3>
          <p className="text-2xl font-bold mt-2 text-orange-600">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
          <h3 className="text-gray-500 text-sm">New Applicant this week</h3>
          <p className="text-2xl font-bold mt-2 text-orange-600">{stats.newThisWeek}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
          <h3 className="text-gray-500 text-sm">Accepted Applicants</h3>
          <p className="text-2xl font-bold mt-2 text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
          <h3 className="text-gray-500 text-sm">Rejected Applicants</h3>
          <p className="text-2xl font-bold mt-2 text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Applicants over time</h2>
            <select className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Chart placeholder
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Applicants by Age</h2>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Chart placeholder
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Female</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-700 rounded-full"></div>
              <span>Male</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Total Applicants</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-black text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative inline-block text-left sort-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSortOpen(!sortOpen);
                }}
                className="flex items-center gap-1 text-sm text-gray-600 border border-gray-300 rounded px-3 py-2 hover:bg-gray-50"
              >
                Sort by: {sortOption.label}
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>

              {sortOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortOption(option);
                          setSortOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortOption.value === option.value
                            ? 'bg-orange-50 text-orange-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export CSV */}
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-3 py-2 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded text-orange-600 focus:ring-orange-500" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No applicants found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input type="checkbox" className="rounded text-orange-600 focus:ring-orange-500" />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      #{applicant.id.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(applicant.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 hover:underline">
                      <Link href={`/admin/applicants/${applicant.id}`} className="font-medium">
                        {applicant.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          applicant.status.trim() === 'Accepted'
                            ? 'bg-green-100 text-green-800'
                            : applicant.status.trim() === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {applicant.status.trim()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-orange-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-orange-500"></div>
              <p className="text-gray-600">
                <span className="font-medium">User #10{i}2</span> registered • 2 hours ago
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}