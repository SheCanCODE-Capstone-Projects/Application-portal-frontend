// src/app/@admin/dashboard/settings/page.tsx
'use client';

import { useState } from 'react';
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  UserIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  // State for each section's open/closed state
  const [participationOpen, setParticipationOpen] = useState(true);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [identityOpen, setIdentityOpen] = useState(false);
  const [exceptionsOpen, setExceptionsOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  // Participation Rules state
  const [enforceSingleProgram, setEnforceSingleProgram] = useState(true);
  const [participationStatuses, setParticipationStatuses] = useState({
    applied: true,
    accepted: true,
    programStarted: true,
  });

  // Mock programs
  const approvedPrograms = [
    { id: 1, name: 'Igire Rwanda', active: true },
    { id: 2, name: 'kLab', active: true },
    { id: 3, name: 'Solvit Africa', active: true },
  ];

  // Mock audit log
  const auditLog = [
    { time: '2025-03-12 14:32', actor: 'Super Admin', action: 'Override granted', target: 'Participant ID 48392', reason: 'Medical withdrawal' },
    { time: '2025-03-11 09:15', actor: 'DSE Admin', action: 'Program activated', target: 'kLab' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      <p className="text-gray-600 mb-6">
        Configure rules, programs, and overrides for the application portal.
      </p>

      {/* Participation Rules */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <button
          onClick={() => setParticipationOpen(!participationOpen)}
          className="flex justify-between items-center w-full px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-lg font-semibold">Participation Rules</h2>
              <p className="text-sm text-gray-500">Receive single-program participation</p>
            </div>
          </div>
          {participationOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {participationOpen && (
          <div className="px-6 pb-6 pt-4 border-t border-gray-200 space-y-4">
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforceSingleProgram}
                  onChange={(e) => setEnforceSingleProgram(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    enforceSingleProgram ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      enforceSingleProgram ? 'translate-x-4' : ''
                    }`}
                  ></span>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Enforce single-program participation
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              A participant cannot apply to another DSE-supported program once accepted into an active program.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Participation Statuses:</h3>
                <div className="space-y-2">
                  {Object.entries(participationStatuses).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setParticipationStatuses({ ...participationStatuses, [key]: e.target.checked })
                        }
                        className="rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">When is participant locked to:</h3>
                <div className="space-y-2">
                  {['Accepted', 'Program started'].map((status) => (
                    <label key={status} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-600">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Approved Programs */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <button
          onClick={() => setProgramsOpen(!programsOpen)}
          className="flex justify-between items-center w-full px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-lg font-semibold">Approved Programs</h2>
              <p className="text-sm text-gray-500">Manage DSE-approved programs</p>
            </div>
          </div>
          {programsOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {programsOpen && (
          <div className="px-6 pb-6 pt-4 border-t border-gray-200">
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {approvedPrograms.map((program) => (
                    <tr key={program.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{program.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            program.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {program.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Participant Identity */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <button
          onClick={() => setIdentityOpen(!identityOpen)}
          className="flex justify-between items-center w-full px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <UserIcon className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-lg font-semibold">Participant Identity</h2>
              <p className="text-sm text-gray-500">Define unique identifier for participants to prevent duplicate applications.</p>
            </div>
          </div>
          {identityOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {identityOpen && (
          <div className="px-6 pb-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Primary identifiers used to uniquely identify participants across all programs:
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">National ID</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">Email</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              These fields are used to link applications to the same person.
            </p>
          </div>
        )}
      </section>

      {/* Exceptions & Overrides */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <button
          onClick={() => setExceptionsOpen(!exceptionsOpen)}
          className="flex justify-between items-center w-full px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-lg font-semibold">Exceptions & Overrides</h2>
              <p className="text-sm text-gray-500">Allow admin-controlled exceptions to participation rules.</p>
            </div>
          </div>
          {exceptionsOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {exceptionsOpen && (
          <div className="px-6 pb-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="sr-only"
                />
                <div
                  className={`relative w-10 h-6 rounded-full transition-colors bg-orange-500`}
                >
                  <span
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-4`}
                  ></span>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Allow Super Admin to override participation rule
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Override justification required.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Super Admin can grant exceptions to single-program participation rule with a required justification.
            </p>

            <div className="mt-4">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm">
                View Override Log
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Audit Log */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200">
        <button
          onClick={() => setAuditOpen(!auditOpen)}
          className="flex justify-between items-center w-full px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <ClockIcon className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-lg font-semibold">Audit Log</h2>
              <p className="text-sm text-gray-500">View system actions and rule changes.</p>
            </div>
          </div>
          {auditOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {auditOpen && (
          <div className="px-6 pb-6 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              {auditLog.map((log, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-mono">{log.time}</span>
                    <span className="text-xs text-gray-700">·</span>
                    <span className="text-xs text-gray-700 font-medium">{log.actor}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">{log.action}</span> for <span className="font-medium">{log.target}</span>
                  </p>
                  {log.reason && (
                    <p className="text-xs text-gray-500 mt-1">
                      Reason: {log.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                View Full Audit Log →
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}