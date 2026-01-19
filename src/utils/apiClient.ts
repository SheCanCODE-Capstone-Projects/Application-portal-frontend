import { tokenUtils } from '@/utils/token';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export const apiClient = {
  async fetch(url: string, options: RequestInit = {}) {
    const token = tokenUtils.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      tokenUtils.removeToken();
      tokenUtils.removeUser();
      window.location.href = '/auth/login';
      throw new Error('Session expired. Please login again.');
    }

    return response;
  },

  async get(url: string) {
    return this.fetch(url, { method: 'GET' });
  },

  async post(url: string, data: any) {
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async put(url: string, data: any) {
    return this.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(url: string) {
    return this.fetch(url, { method: 'DELETE' });
  },
};
