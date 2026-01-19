// src/app/admin/dashboard/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { AdminUserProvider, useUsers } from '@/contexts/AdminUserContext';

function UsersContent() {
  const { users, loading, fetchUsers, softDeleteUser } = useUsers();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchUsers();
    
    // Check screen size on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to soft delete ${name}?`)) return;
    await softDeleteUser(id);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Users Management
        </h1>
        <p className="text-sm text-gray-600">
          List, edit, or soft delete platform users here.
        </p>
      </div>

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            users.map((user) => (
              <div 
                key={user.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base mb-1">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 break-all mb-2">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                    user.role === 'ROLE_ADMIN'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role.replace('ROLE_', '')}
                  </span>
                  
                  <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] lg:min-w-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">
                        <div className="max-w-[150px] sm:max-w-[200px] truncate">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        <div className="max-w-[200px] sm:max-w-[250px] md:max-w-[300px] truncate">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                          user.role === 'ROLE_ADMIN'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <AdminUserProvider>
      <UsersContent />
    </AdminUserProvider>
  );
}