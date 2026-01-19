// src/app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useApplications } from '@/contexts/AdminApplicationContext';

export default function DashboardPage() {
  const { applications, loading, fetchApplications } = useApplications();

  useEffect(() => {
    fetchApplications();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
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
  const [sortOption, setSortOption] = useState(sortOptions[2]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.sort-dropdown')) {
        setSortOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const filteredAndSortedApplicants = useMemo(() => {
    let filtered = applications;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = applications.filter(
        app => app.name.toLowerCase().includes(lower) || app.id.toLowerCase().includes(lower)
      );
    }
    return [...filtered].sort((a, b) => {
      switch (sortOption.value) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'date-desc': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'status-pending': return (a.status.trim() === 'Pending' ? 0 : 1) - (b.status.trim() === 'Pending' ? 0 : 1);
        case 'status-accepted': return (a.status.trim() === 'Accepted' ? 0 : 1) - (b.status.trim() === 'Accepted' ? 0 : 1);
        case 'status-rejected': return (a.status.trim() === 'Rejected' ? 0 : 1) - (b.status.trim() === 'Rejected' ? 0 : 1);
        default: return 0;
      }
    });
  }, [applications, searchTerm, sortOption]);

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status.trim() === 'Pending').length;
    const accepted = applications.filter(a => a.status.trim() === 'Accepted').length;
    const rejected = applications.filter(a => a.status.trim() === 'Rejected').length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = applications.filter(a => new Date(a.date) > weekAgo).length;
    return { total, pending, accepted, rejected, newThisWeek };
  }, [applications]);

  const handleDownloadCSV = () => {
    const headers = ['Student ID', 'Date', 'Name', 'Status'];
    const rows = filteredAndSortedApplicants.map(app =>
      `"${app.id}","${app.date}","${app.name}","${app.status.trim()}"`
    );
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applicants_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-5">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Applicants</h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">New this week</h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">{stats.newThisWeek}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Accepted</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{stats.accepted}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Rejected</h3>
          <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Applicants over time</h2>
            <select className="w-full sm:w-auto text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-56 sm:h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
            Chart placeholder
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Applicants by Age</h2>
          <div className="h-56 sm:h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
            Chart placeholder
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Female</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-700 rounded-full"></div>
              <span>Male</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col gap-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Total Applicants</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Sort */}
              <div className="relative sort-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSortOpen(!sortOpen);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span className="truncate">Sort: {sortOption.label}</span>
                  <ChevronDownIcon className={`h-4 w-4 ml-2 flex-shrink-0 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>

                {sortOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortOption(option);
                          setSortOpen(false);
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm ${
                          sortOption.value === option.value
                            ? 'bg-orange-50 text-orange-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export */}
              <button
                onClick={handleDownloadCSV}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden xs:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs sm:text-sm">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded text-orange-600" />
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
              {filteredAndSortedApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No applicants found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <input type="checkbox" className="rounded text-orange-600" />
                    </td>
                    <td className="px-3 py-3 font-medium text-gray-900">
                      #{applicant.id.toUpperCase()}
                    </td>
                    <td className="px-3 py-3 text-gray-500">
                      {new Date(applicant.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin/applicants/${applicant.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {applicant.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        applicant.status.trim() === 'Accepted' ? 'bg-green-100 text-green-800' :
                        applicant.status.trim() === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
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

      {/* Recent Activity */}
      <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-orange-100">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">User #10{i}2</span> registered • 2 hours ago
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}