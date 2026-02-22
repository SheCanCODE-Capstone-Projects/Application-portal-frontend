import { api } from "@/lib/api/api";
import { NOTIFICATION_ROUTES } from "@/services/notification/notification-controller";

// Backend returns "read"
export interface Notification {
    id: string;
    title: string;
    message: string;
    type:
        | "APPLICATION_STARTED"
        | "APPLICATION_SUBMITTED"
        | "APPLICATION_UNDER_REVIEW"
        | "APPLICATION_ACCEPTED"
        | "APPLICATION_REJECTED"
        | "INTERVIEW_SCHEDULED"
        | "GENERAL"
        | "REMINDER_INCOMPLETE"
        | "REMINDER_PROGRAM_START"
        | "REMINDER_UNDER_REVIEW"
        | "ADMIN_DAILY_SUMMARY"
        | string;
    read: boolean; // CHANGED
    createdAt: string;
    readAt?: string | null;
    applicationId?: string | null;
    applicationStatus?: string | null;
}

export interface AdminNotification {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean; // CHANGED
    createdAt: string;
    readAt?: string | null;
}

export interface NotificationCount {
    count: number;
}

export const notificationService = {
    getAll: async (token: string): Promise<Notification[]> => {
        const res = await api.get(NOTIFICATION_ROUTES.ALL_NOTIFICATIONS, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.data ?? res.data ?? [];
    },

    getUnread: async (token: string): Promise<Notification[]> => {
        const res = await api.get(NOTIFICATION_ROUTES.UNREAD_NOTIFICATIONS, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.data ?? res.data ?? [];
    },

    getUnreadCount: async (token: string): Promise<number> => {
        const res = await api.get(NOTIFICATION_ROUTES.UNREAD_COUNT, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const payload = res.data?.data ?? res.data;
        return payload?.count ?? 0;
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

export const adminNotificationService = {
    getAll: async (token: string): Promise<AdminNotification[]> => {
        const res = await api.get(NOTIFICATION_ROUTES.ADMIN_ALL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.data ?? res.data ?? [];
    },

    getUnread: async (token: string): Promise<AdminNotification[]> => {
        const res = await api.get(NOTIFICATION_ROUTES.ADMIN_UNREAD, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.data ?? res.data ?? [];
    },

    getUnreadCount: async (token: string): Promise<number> => {
        const res = await api.get(NOTIFICATION_ROUTES.ADMIN_UNREAD_COUNT, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const payload = res.data?.data ?? res.data;
        return payload?.count ?? 0;
    },

    markAsRead: async (id: string, token: string): Promise<void> => {
        const url = NOTIFICATION_ROUTES.ADMIN_MARK_AS_READ.replace("{id}", id);
        await api.put(url, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    markAllAsRead: async (token: string): Promise<void> => {
        await api.put(NOTIFICATION_ROUTES.ADMIN_MARK_ALL_AS_READ, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};