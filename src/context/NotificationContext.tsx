'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { api } from '@/lib/api/api';
import { Notification } from '@/services/notification/notification-service';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const stompClientRef = useRef<Client | null>(null);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) return;

            const res = await api.get("/api/v1/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const notificationsData: Notification[] = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data?.content)
                        ? res.data.content
                        : [];

            setNotifications(notificationsData);
            // Count using the proper .read property
            setUnreadCount(notificationsData.filter(n => !n.read).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        fetchNotifications();

        let apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        apiUrl = apiUrl.trim().replace(/\/+$/, '');

        if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
            apiUrl = apiUrl.replace(/^http:/i, 'https:');
        }

        const socket = new SockJS(`${apiUrl}/ws`);

        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { Authorization: `Bearer ${token}` },
            debug: (str) => {
                if (process.env.NODE_ENV === 'development') console.log('STOMP:', str);
            },
            onConnect: () => {
                client.subscribe(`/user/queue/notifications`, (message) => {
                    if (message.body) {
                        const newNotification: Notification = JSON.parse(message.body);
                        handleNewNotification(newNotification);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error:', frame.headers['message']);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, []);

    const handleNewNotification = (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        toast(notification.title, {
            description: notification.message,
            action: {
                label: "View",
                onClick: () => window.location.href = '/applicant/dashboard/notifications'
            },
            duration: 6000,
        });
    };

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/api/v1/notifications/${id}/read`);
            // Update mapping using .read
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put(`/api/v1/notifications/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, loading }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within NotificationProvider");
    return context;
};