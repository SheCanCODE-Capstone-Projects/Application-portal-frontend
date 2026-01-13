// NEW: Global state for applications  
// src/contexts/AdminApplicationContext.tsx

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  status: string;
  program: string;
  cohort: string;
  progress: number;
  gender: string;
  education?: string;
  experience?: string;
}

interface AdminApplicationContextType {
  applications: Application[];
  loading: boolean;
  fetchApplications: () => Promise<void>;
  acceptApplication: (id: string) => Promise<void>;
  rejectApplication: (id: string) => Promise<void>;
  // Add more actions later
}

const AdminApplicationContext = createContext<AdminApplicationContextType | undefined>(undefined);

export function AdminApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/applications');
      setApplications(res.data);
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const acceptApplication = async (id: string) => {
    try {
      await api.put(`/admin/applications/${id}/accept`);
      setApplications(prev =>
        prev.map(app => app.id === id ? { ...app, status: 'Accepted' } : app)
      );
      toast.success('Application accepted');
    } catch (err) {}
  };

  const rejectApplication = async (id: string) => {
    try {
      await api.put(`/admin/applications/${id}/reject`);
      setApplications(prev =>
        prev.map(app => app.id === id ? { ...app, status: 'Rejected' } : app)
      );
      toast.success('Application rejected');
    } catch (err) {}
  };

  return (
    <AdminApplicationContext.Provider value={{
      applications,
      loading,
      fetchApplications,
      acceptApplication,
      rejectApplication,
    }}>
      {children}
    </AdminApplicationContext.Provider>
  );
}

export const useApplications = () => {
  const context = useContext(AdminApplicationContext);
  if (!context) throw new Error('useApplications must be used within AdminApplicationProvider');
  return context;
};