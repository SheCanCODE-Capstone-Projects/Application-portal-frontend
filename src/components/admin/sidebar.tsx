// src/components/admin/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/hooks/useAuth';
import {
  Squares2X2Icon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon:  Squares2X2Icon },
  { name: 'Users', href: '/admin/dashboard/users', icon: UsersIcon },
  { name: 'Reports', href: '/admin/dashboard/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Logout in mobile */}
            <button
              onClick={() => {
                logout();
                setSidebarOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 mt-4 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:z-40 ${
        isCollapsed ? 'lg:w-20' : 'lg:w-64'
      }`}>
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          {/* Desktop header */}
          <div className={`flex items-center h-16 px-4 border-b border-gray-200 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            {!isCollapsed && (
              <span className="text-xl font-bold text-gray-900">Admin Dashboard
              
              </span>
            )}
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                  {!isCollapsed && item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop logout and collapse */}
          <div className="p-4 border-t border-gray-200">
            {/* Logout button */}
            <button
              onClick={logout}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <ArrowLeftOnRectangleIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && 'Logout'}
            </button>
            
            {/* Collapse button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`flex items-center w-full mt-4 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <>
                  <ChevronLeftIcon className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="text-gray-700">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white text-gray-700 border border-gray-300 shadow-sm lg:hidden hover:bg-gray-50"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="w-6 h-6" />
      </button>
    </>
  );
}