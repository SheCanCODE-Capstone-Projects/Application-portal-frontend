import { UserRole } from '@/types/auth';

export const ROLES: Record<string, UserRole> = {
  APPLICANT: 'APPLICANT',
  ADMIN: 'ADMIN',
  REVIEWER: 'REVIEWER',
};

export const ROLE_ROUTES: Record<UserRole, string> = {
  APPLICANT: '/applicant/dashboard',
  ADMIN: '/admin/dashboard',
  REVIEWER: '/reviewer/dashboard',
};
