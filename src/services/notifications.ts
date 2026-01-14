import { apiClient } from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface NotificationCount {
  unreadCount: number;
}

class NotificationService {
  async getAllNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>('/api/v1/notifications');
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>('/api/v1/notifications/unread');
  }

  async getUnreadCount(): Promise<NotificationCount> {
    return apiClient.get<NotificationCount>('/api/v1/notifications/unread/count');
  }

  async markAsRead(id: string): Promise<void> {
    return apiClient.put<void>(`/api/v1/notifications/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    return apiClient.put<void>('/api/v1/notifications/read-all');
  }
}

export const notificationService = new NotificationService();