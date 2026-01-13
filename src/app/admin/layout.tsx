// src/app/admin/layout.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminApplicationProvider } from '@/contexts/AdminApplicationContext';
import { AdminUserProvider } from '@/contexts/AdminUserContext';
import { CohortProvider } from '@/contexts/CohortContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role !== null && !isAdmin) {
      router.replace('/access-denied');
    }
  }, [role, isAdmin, router]);

  if (role === null) {
    return <div className="p-8 text-center">Checking permissions...</div>;
  }

  if (!isAdmin) {
    return null; // will redirect
  }

  return (
    <NotificationProvider>
      <AdminUserProvider>
        <CohortProvider>
          <AdminApplicationProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </AdminApplicationProvider>
        </CohortProvider>
      </AdminUserProvider>
    </NotificationProvider>
  );
}