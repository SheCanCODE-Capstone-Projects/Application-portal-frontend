import { apiClient } from './api';
import { apiConfig } from '../lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
}

export interface Application {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  cohort: string;
}

export interface ApplicationProgress {
  id: string;
  personalInfo: number;
  academicHistory: number;
  references: number;
  documents: number;
  overall: number;
}

class UserService {
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(apiConfig.endpoints.user.profile);
  }

  async getApplications(): Promise<Application[]> {
    return apiClient.get<Application[]>(apiConfig.endpoints.user.applications);
  }

  async getApplicationProgress(id: string): Promise<ApplicationProgress> {
    return apiClient.get<ApplicationProgress>(
      apiConfig.endpoints.user.applicationProgress(id)
    );
  }
}

export const userService = new UserService();