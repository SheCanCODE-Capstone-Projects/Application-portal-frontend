'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { tokenUtils } from '@/utils/token';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
  login: (token: string, user: User, rememberMe?: boolean, expiresIn?: number) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      const token = tokenUtils.getToken();
      const user = tokenUtils.getUser();

      if (token && user) {
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = (token: string, user: User, rememberMe: boolean = false, expiresIn?: number) => {
    tokenUtils.setToken(token, rememberMe);
    tokenUtils.setUser(user);

    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });

    if (expiresIn) {
      setTimeout(() => {
        logout();
      }, expiresIn * 1000);
    }
  };

  const logout = () => {
    tokenUtils.removeToken();
    tokenUtils.removeUser();

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    router.push('/auth/login');
  };

  const updateUser = (user: User) => {
    tokenUtils.setUser(user);
    setState((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
