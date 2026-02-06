"use client";

import { useState, useCallback } from "react";
import { notificationService, Notification } from "@/services/notification/notification-service";
// import { useWebSocket } from "@/hooks/useWebSocket";

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    fetchNotifications: () => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => localStorage.getItem("access_token");

    const fetchNotifications = useCallback(async () => {
        const token = getToken();
        if (!token) return;

        setLoading(true);
        setError(null);
        try {
            const data = await notificationService.getAll(token);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const message = error.response?.data?.message || error.message || "Failed to fetch notifications";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        const token = getToken();
        if (!token) return;

        try {
            const data = await notificationService.getUnreadCount(token);
            setUnreadCount(data.count || 0);
        } catch (err: unknown) {
            console.error("Failed to fetch unread count:", err);
        }
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        const token = getToken();
        if (!token) return;

        try {
            await notificationService.markAsRead(id, token);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err: unknown) {
            console.error("Failed to mark as read:", err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        const token = getToken();
        if (!token) return;

        try {
            await notificationService.markAllAsRead(token);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err: unknown) {
            console.error("Failed to mark all as read:", err);
        }
    }, []);

    // useWebSocket({
    //     onMessage: (data) => {
    //         if (data.type === "NOTIFICATION") {
    //             fetchNotifications();
    //             fetchUnreadCount();
    //         }
    //     },
    // });

    return {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
    };
}
