import { useState, useEffect } from 'react';
import { userService, UserProfile, Application, ApplicationProgress } from '@/services/user';

interface DashboardData {
  profile: UserProfile | null;
  applications: Application[];
  progress: ApplicationProgress | null;
  loading: boolean;
  error: string | null;
}

export const useDashboardData = (): DashboardData => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [progress, setProgress] = useState<ApplicationProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [profileData, applicationsData] = await Promise.all([
          userService.getProfile(),
          userService.getApplications()
        ]);
        
        setProfile(profileData);
        setApplications(applicationsData);
        
        if (applicationsData.length > 0) {
          const progressData = await userService.getApplicationProgress(applicationsData[0].id);
          setProgress(progressData);
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    profile,
    applications,
    progress,
    loading,
    error
  };
};