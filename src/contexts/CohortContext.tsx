// src/contexts/CohortContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  maxParticipants: number;
  currentParticipants: number;
}

interface CohortContextType {
  cohorts: Cohort[];
  loading: boolean;
  fetchCohorts: () => Promise<void>;
  createCohort: (data: Omit<Cohort, 'id'>) => Promise<void>;
  updateCohort: (id: string, data: Partial<Cohort>) => Promise<void>;
  deleteCohort: (id: string) => Promise<void>;
}

const CohortContext = createContext<CohortContextType | undefined>(undefined);

export function CohortProvider({ children }: { children: ReactNode }) {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCohorts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/cohorts');
      setCohorts(res.data);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const createCohort = async (data: Omit<Cohort, 'id'>) => {
    try {
      const res = await api.post('/admin/cohorts', data);
      setCohorts(prev => [...prev, res.data]);
      toast.success('Cohort created successfully');
    } catch (err) {}
  };

  const updateCohort = async (id: string, data: Partial<Cohort>) => {
    try {
      const res = await api.put(`/admin/cohorts/${id}`, data);
      setCohorts(prev => prev.map(c => c.id === id ? res.data : c));
      toast.success('Cohort updated successfully');
    } catch (err) {}
  };

  const deleteCohort = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cohort?')) return;
    try {
      await api.delete(`/admin/cohorts/${id}`);
      setCohorts(prev => prev.filter(c => c.id !== id));
      toast.success('Cohort deleted');
    } catch (err) {}
  };

  return (
    <CohortContext.Provider value={{
      cohorts,
      loading,
      fetchCohorts,
      createCohort,
      updateCohort,
      deleteCohort,
    }}>
      {children}
    </CohortContext.Provider>
  );
}

export const useCohorts = () => {
  const context = useContext(CohortContext);
  if (!context) throw new Error('useCohorts must be used within CohortProvider');
  return context;
};