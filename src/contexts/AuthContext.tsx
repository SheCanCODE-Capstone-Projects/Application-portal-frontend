// NEW: AuthContext for token + role management
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>('fake-token-for-testing');
  const [role, setRole] = useState<string | null>('ROLE_ADMIN');

  // useEffect(() => {
  //   const savedToken = localStorage.getItem('authToken');
  //   const savedRole = localStorage.getItem('userRole');
  //   if (savedToken && savedRole) {
  //     setToken(savedToken);
  //     setRole(savedRole);
  //   }
  // }, []);

  const login = (newToken: string, userRole: string) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userRole', userRole);
    setToken(newToken);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setToken(null);
    setRole(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAdmin: role === 'ROLE_ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};