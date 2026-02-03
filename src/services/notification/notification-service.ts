import { NOTIFICATION_ROUTES } from "./notification-controller";
import { api } from "@/lib/api/api";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "WARNING" | "SUCCESS" | "ERROR" | "system" | "alert" | "user";
    isRead: boolean;
    createdAt: string;
}

export interface NotificationCount {
    count: number;
}

export const notificationService = {
    getAll: async (token: string): Promise<Notification[]> => {
        const res = await api.get(NOTIFICATION_ROUTES.ALL_NOTIFICATIONS, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data.data || res.data;
    },

    getUnread: async (token: string): Promise<Notification[]> => {
        const res = await api.get(NOTIFICATION_ROUTES.UNREAD_NOTIFICATIONS, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data.data || res.data;
    },

    getUnreadCount: async (token: string): Promise<NotificationCount> => {
        const res = await api.get(NOTIFICATION_ROUTES.UNREAD_COUNT, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data.data || res.data;
    },

    markAsRead: async (id: string, token: string): Promise<void> => {
        const url = NOTIFICATION_ROUTES.MARK_AS_READ.replace("{id}", id);
        await api.put(url, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    markAllAsRead: async (token: string): Promise<void> => {
        await api.put(NOTIFICATION_ROUTES.MARK_ALL_AS_READ, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    delete: async (id: string, token: string): Promise<void> => {
        const url = NOTIFICATION_ROUTES.DELETE.replace("{id}", id);
        await api.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};