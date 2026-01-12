import { apiClient } from './api';
import { apiConfig } from '../lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface NotificationCount {
  unread: number;
}

class NotificationService {
  async getAllNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>(apiConfig.endpoints.notifications.all);
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>(apiConfig.endpoints.notifications.unread);
  }

  async getUnreadCount(): Promise<NotificationCount> {
    return apiClient.get<NotificationCount>(apiConfig.endpoints.notifications.unreadCount);
  }

  async markAsRead(id: string): Promise<void> {
    return apiClient.put<void>(apiConfig.endpoints.notifications.markRead(id));
  }

  async markAllAsRead(): Promise<void> {
    return apiClient.put<void>(apiConfig.endpoints.notifications.markAllRead);
  }
}

export const notificationService = new NotificationService();
