'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  User, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell
} from 'lucide-react';
import { userService, UserProfile } from '@/services/user';
import { notificationService, NotificationCount } from '@/services/notifications';
import NotificationPanel from './NotificationPanel';

const navigation = [
  { name: 'Dashboard', href: '/applicant/dashboard', icon: Home },
  { name: 'Profile', href: '/applicant/dashboard/profile', icon: User },
  { name: 'Applications', href: '/applicant/dashboard/applications', icon: FileText },
  { name: 'Settings', href: '/applicant/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await userService.getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Set fallback profile data when API fails
        setProfile({
          id: 'APP-2025-001',
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+250 788 123 456',
          role: 'applicant'
        });
      }
    };

    const fetchNotificationCount = async () => {
      try {
        const countData = await notificationService.getUnreadCount();
        setNotificationCount(countData.unreadCount);
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
        // Set fallback count to 0 when API fails
        setNotificationCount(0);
      }
    };

    fetchProfile();
    fetchNotificationCount();
    
    // Only poll for notifications if not in development mode
    const interval = setInterval(() => {
      if (process.env.NODE_ENV !== 'development') {
        fetchNotificationCount();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent pathname={pathname} profile={profile} notificationCount={notificationCount} onNotificationClick={() => setNotificationPanelOpen(true)} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Application Portal</h2>
          </div>
          <SidebarContent pathname={pathname} profile={profile} notificationCount={notificationCount} onNotificationClick={() => setNotificationPanelOpen(true)} />
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-1 right-1 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 rounded-lg bg-white shadow-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>
      
      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={notificationPanelOpen} 
        onClose={() => setNotificationPanelOpen(false)} 
      />
    </>
  );
}

function SidebarContent({ pathname, profile, notificationCount, onNotificationClick }: { 
  pathname: string; 
  profile: UserProfile | null;
  notificationCount: number;
  onNotificationClick: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-900 border-r-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-5 w-5 ${
                  isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Notification Button */}
      <div className="px-2 pb-4">
        <button
          onClick={onNotificationClick}
          className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 relative"
        >
          <Bell className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400" />
          Notifications
          {notificationCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>
      </div>
      
      {/* User section */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{profile?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{profile?.id || 'N/A'}</p>
          </div>
        </div>
        <button className="mt-3 w-full flex items-center px-2 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}