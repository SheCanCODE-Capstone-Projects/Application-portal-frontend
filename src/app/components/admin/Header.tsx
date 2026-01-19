// src/components/@admin/Header.tsx
'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Header({
  setSidebarOpen,
}: {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu button + title */}
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
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="relative rounded-full p-1 text-gray-600 hover:text-orange-600 focus:outline-none"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange-500"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="p-2">
                  <div className="block px-4 py-2 text-sm text-gray-700">No new notifications</div>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
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
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <a
                    href="/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    href="/api/auth/logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
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