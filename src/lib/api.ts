const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: '/api/v1/auth/login',
      logout: '/api/v1/auth/logout',
      refresh: '/api/v1/auth/refresh',
    },
    user: {
      profile: '/api/v1/users/me',
      applications: '/api/v1/user/applications/my-application',
      applicationProgress: (id: string) => `/api/v1/user/applications/${id}/progress`,
    },
    notifications: {
      all: '/api/v1/notifications',
      unread: '/api/v1/notifications/unread',
      unreadCount: '/api/v1/notifications/unread/count',
      markRead: (id: string) => `/api/v1/notifications/${id}/read`,
      markAllRead: '/api/v1/notifications/read-all',
    },
  },
};