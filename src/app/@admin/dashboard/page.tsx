// src/app/@admin/dashboard/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  // ✅ Applicants data (now in state for reactivity)
  const [applicants] = useState([
    { id: '#Stud-001', date: '2025-12-02', name: 'Tabitha Kunda', status: 'Pending' },
    { id: '#Stu-002', date: '2025-12-01', name: 'Aurore Ineza', status: 'Accepted' },
    { id: '#Stu-003', date: '2025-11-30', name: 'Ritha Irakoze', status: '  Accepted' },
    { id: '#Stu-004', date: '2025-12-03', name: 'Jean Paul', status: 'Pending' },
    { id: '#Stu-005', date: '2025-11-28', name: 'Benjamin Mugisha', status: 'Rejected' },
  ]);

  // ✅ Sort state
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
  const [sortOption, setSortOption] = useState(sortOptions[2]); // Date: Newest

  // ✅ Close dropdown on outside click
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

  // ✅ Compute sorted applicants (reactive)
  const sortedApplicants = useMemo(() => {
    return [...applicants].sort((a, b) => {
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
          return (a.status === 'Pending' ? 0 : 1) - (b.status === 'Pending' ? 0 : 1);
        case 'status-accepted':
          return (a.status === 'Accepted' ? 0 : 1) - (b.status === 'Accepted' ? 0 : 1);
        case 'status-rejected':
          return (a.status === 'Rejected' ? 0 : 1) - (b.status === 'Rejected' ? 0 : 1);
        default:
          return 0;
      }
    });
  }, [applicants, sortOption]);

  // ✅ CSV Export (improved for Excel)
  const handleDownloadCSV = () => {
    
    const headers = ['Student ID', 'Date', 'Name', 'Status'];
    const rows = applicants.map(app => 
      `"${app.id}","${app.date}","${app.name}","${app.status}"`
    );
    const csvContent = 'text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applicants_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div>
      {/* Stats Cards */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['Total Applicants', 'New Applicant this week', 'Accepted Applicants', 'Rejected Applicants'].map((title, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
            <h3 className="text-gray-500 text-sm">{title}</h3>
            <p className="text-2xl font-bold mt-2 text-orange-600">
              {i === 0 ? '1,248' : i === 1 ? '42' : i === 2 ? '243' : '79'}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
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
                        type="button"
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
              {sortedApplicants.map((applicant, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input type="checkbox" className="rounded text-orange-600 focus:ring-orange-500" />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{applicant.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(applicant.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{applicant.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        applicant.status === 'Accepted'
                          ? 'bg-green-100 text-green-800'
                          : applicant.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {applicant.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
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