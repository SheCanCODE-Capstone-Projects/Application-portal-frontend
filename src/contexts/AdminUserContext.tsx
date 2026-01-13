// src/contexts/AdminUserContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'archived' | 'deleted';
  createdAt: string;
}

interface AdminUserContextType {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  softDeleteUser: (id: string) => Promise<void>;
}

const AdminUserContext = createContext<AdminUserContextType | undefined>(undefined);

export function AdminUserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      // Error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const softDeleteUser = async (id: string) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User soft-deleted successfully');
    } catch (err) {
      // Handled by interceptor
    }
  };

  return (
    <AdminUserContext.Provider value={{ users, loading, fetchUsers, softDeleteUser }}>
      {children}
    </AdminUserContext.Provider>
  );
}

export const useUsers = () => {
  const context = useContext(AdminUserContext);
  if (!context) throw new Error('useUsers must be used within AdminUserProvider');
  return context;
};