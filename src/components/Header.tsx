'use client';

import { Bell, User, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { userService, UserProfile } from '@/services/user';
import { notificationService } from '@/services/notifications';
import NotificationPanel from './NotificationPanel';

export default function Header() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, countData] = await Promise.all([
          userService.getProfile(),
          notificationService.getUnreadCount()
        ]);
        setProfile(profileData);
        setNotificationCount(countData.unreadCount);
      } catch (error) {
        console.error('Failed to fetch header data:', error);
        setProfile({
          id: 'APP-2025-001',
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+250 788 123 456',
          role: 'applicant'
        });
        setNotificationCount(0);
      }
    };

    fetchData();
    
    const interval = setInterval(() => {
      if (process.env.NODE_ENV !== 'development') {
        notificationService.getUnreadCount()
          .then(data => setNotificationCount(data.unreadCount))
          .catch(() => setNotificationCount(0));
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">Participant Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            onClick={() => setNotificationPanelOpen(true)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">{profile?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{profile?.role || 'Applicant'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </header>

      <NotificationPanel 
        isOpen={notificationPanelOpen} 
        onClose={() => setNotificationPanelOpen(false)} 
      />
    </>
  );
}
