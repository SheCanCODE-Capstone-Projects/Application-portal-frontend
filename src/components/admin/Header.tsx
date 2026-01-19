// src/components/admin/Header.tsx
'use client';

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useNotifications } from '@/contexts/NotificationContext';

export default function Header({
  setSidebarOpen,
}: {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { unreadCount, notifications, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.notifications-dropdown') && !(e.target as HTMLElement).closest('.profile-dropdown')) {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu + title */}
        <div className="flex items-center">
          <button
            type="button"
            className="lg:hidden mr-3 text-gray-500 hover:text-orange-600"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">Admin Dashboard</h1>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications Bell */}
          <div className="relative notifications-dropdown">
            <button
              type="button"
              className="relative rounded-full p-1 text-gray-600 hover:text-orange-600 focus:outline-none"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                if (!notifications.length && !loading) fetchNotifications();
              }}
            >
              <BellIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {loading ? (
                    <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
                  ) : notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>
                  ) : (
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                          <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(notif.createdAt).toLocaleString()}
                            </span>
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                            >
                              Mark as read
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-600 focus:outline-none"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <UserCircleIcon className="h-8 w-8 text-gray-500" />
              <span className="hidden md:block">Admin User</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <a href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </a>
                  <a href="/api/auth/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}  