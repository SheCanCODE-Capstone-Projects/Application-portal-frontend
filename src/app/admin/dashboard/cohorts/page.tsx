// src/app/admin/dashboard/cohorts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { CohortProvider, useCohorts } from '@/contexts/CohortContext';

function CohortsPageContent() {
  const { cohorts, loading, fetchCohorts, createCohort, updateCohort, deleteCohort } = useCohorts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'upcoming' as 'upcoming' | 'active' | 'completed',
    maxParticipants: 50,
    currentParticipants: 0,
  });

  useEffect(() => {
    fetchCohorts();
  }, []);

  const openModal = (cohort: any = null) => {
    if (cohort) {
      setEditingCohort(cohort);
      setFormData({
        name: cohort.name || '',
        startDate: cohort.startDate ? cohort.startDate.split('T')[0] : '',
        endDate: cohort.endDate ? cohort.endDate.split('T')[0] : '',
        status: cohort.status || 'upcoming',
        maxParticipants: cohort.maxParticipants || 50,
        currentParticipants: cohort.currentParticipants || 0,
      });
    } else {
      setEditingCohort(null);
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        status: 'upcoming',
        maxParticipants: 50,
        currentParticipants: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      maxParticipants: Number(formData.maxParticipants),
      currentParticipants: Number(formData.currentParticipants),
    };

    try {
      if (editingCohort) {
        await updateCohort(editingCohort.id, data);
      } else {
        await createCohort(data);
      }
      setIsModalOpen(false);
      fetchCohorts();
    } catch (err) {
      // Error handled by global interceptor
    }
  };

  const handleDelete = async (cohort: any) => {
    if (!confirm(`Are you sure you want to delete cohort "${cohort.name}"?`)) return;
    try {
      await deleteCohort(cohort.id);
      fetchCohorts();
    } catch (err) {
      // Handled globally
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <p className="text-gray-600">Loading cohorts...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Cohort Management</h1>
            <p className="text-sm text-gray-600 mt-1">Create and manage program cohorts</p>
          </div>
          <button
            onClick={() => openModal()}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            + Create New Cohort
          </button>
        </div>
      </div>

      {/* Mobile Card View (for screens < 640px) */}
      <div className="block sm:hidden space-y-4">
        {cohorts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-gray-500 mb-4">No cohorts created yet.</p>
            <button
              onClick={() => openModal()}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Create New Cohort
            </button>
          </div>
        ) : (
          cohorts.map((cohort) => (
            <div 
              key={cohort.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base mb-1">
                    {cohort.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {cohort.startDate && cohort.endDate ? (
                      <>
                        {new Date(cohort.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        –{' '}
                        {new Date(cohort.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </>
                    ) : (
                      'Invalid date'
                    )}
                  </p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => openModal(cohort)}
                    className="text-orange-600 hover:text-orange-800 font-medium text-sm px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cohort)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                  cohort.status === 'active' ? 'bg-green-100 text-green-800' :
                  cohort.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {cohort.status?.charAt(0).toUpperCase() + cohort.status?.slice(1)}
                </span>
                
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{cohort.currentParticipants ?? 0}</span>
                  <span className="text-gray-500"> / {cohort.maxParticipants ?? 0}</span>
                  <span className="ml-1 text-gray-500">participants</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (for screens ≥ 640px) */}
      <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] lg:min-w-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm">
                  Cohort Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm">
                  Dates
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm">
                  Participants
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cohorts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <p className="mb-4">No cohorts created yet.</p>
                      <button
                        onClick={() => openModal()}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        Create New Cohort
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                cohorts.map((cohort) => (
                  <tr key={cohort.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">
                      <div className="max-w-[180px] sm:max-w-[220px] truncate">
                        {cohort.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                      {cohort.startDate && cohort.endDate ? (
                        <>
                          {new Date(cohort.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          –{' '}
                          {new Date(cohort.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </>
                      ) : (
                        'Invalid date'
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                        cohort.status === 'active' ? 'bg-green-100 text-green-800' :
                        cohort.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cohort.status?.charAt(0).toUpperCase() + cohort.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                      {cohort.currentParticipants ?? 0} / {cohort.maxParticipants ?? 0}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openModal(cohort)}
                          className="text-orange-600 hover:text-orange-800 font-medium text-sm hover:bg-orange-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cohort)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Enhanced for Mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-green-800">
                {editingCohort ? 'Edit Cohort' : 'Create New Cohort'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cohort Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="cohort 14"
                    className="w-full px-3 py-2.5 border text-black border-green-800 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none transition-colors text-sm sm:text-base"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2.5 text-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none transition-colors text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2.5 text-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none transition-colors text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 border border-green-800 text-gray-600 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none transition-colors text-sm sm:text-base"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Participants *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 text-gray-600 border border-green-800 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none transition-colors text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-3 bg-green-800 hover:bg-green-800 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  {editingCohort ? 'Update Cohort' : 'Create Cohort'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CohortsPage() {
  return (
    <CohortProvider>
      <CohortsPageContent />
    </CohortProvider>
  );
}