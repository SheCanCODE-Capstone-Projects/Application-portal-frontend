'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROLE_ROUTES } from '@/constants/roles';
import { onboardingUtils } from '@/utils/onboarding';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const expiresIn = searchParams.get('expiresIn');

    if (token && userId && email && role) {
      const user = {
        id: parseInt(userId),
        email,
        role: role as 'APPLICANT' | 'ADMIN' | 'REVIEWER',
      };

      login(token, user, true, expiresIn ? parseInt(expiresIn) : undefined);

      if (!onboardingUtils.isCompleted()) {
        router.push('/onboarding');
      } else {
        router.push(ROLE_ROUTES[user.role]);
      }
    } else {
      router.push('/auth/login?error=oauth_failed');
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
