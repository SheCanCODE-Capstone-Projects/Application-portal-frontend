'use client';

import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

export const useAuthGuard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canAccess = (requiredRoles?: UserRole[]): boolean => {
    if (!isAuthenticated) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return hasRole(requiredRoles);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    hasRole,
    canAccess,
  };
};

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};
