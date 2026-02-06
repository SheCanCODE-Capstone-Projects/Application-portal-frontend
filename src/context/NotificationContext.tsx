'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { api } from '@/lib/api/api';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'APPLICATION_ACCEPTED' | 'APPLICATION_REJECTED' | 'INTERVIEW_SCHEDULED' | 'GENERAL' | 'APPLICATION_SUBMITTED';
    isRead: boolean;
    createdAt: string;
    applicationId?: string;
}

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

    // 1. Fetch Initial Notifications
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) return;

            const res = await api.get("/api/v1/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Normalize response
            const notifications: Notification[] = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data?.content)
                        ? res.data.content
                        : [];

            setNotifications(notifications);
            setUnreadCount(notifications.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Setup Real-Time WebSocket Connection
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        fetchNotifications();

        // 1. Get Base URL
        let apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

        // 2. Clean URL: Trim whitespace and remove trailing slashes
        apiUrl = apiUrl.trim().replace(/\/+$/, '');

        // 3. Force HTTPS protocol if the page is loaded over HTTPS
        // This prevents "SecurityError: An insecure SockJS connection may not be initiated..."
        if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
            apiUrl = apiUrl.replace(/^http:/i, 'https:');
        }

        console.log('Notification WebSocket connecting to:', apiUrl + '/ws');

        const socket = new SockJS(`${apiUrl}/ws`);

        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { Authorization: `Bearer ${token}` },
            debug: (str) => {
                if (process.env.NODE_ENV === 'development') console.log('STOMP:', str);
            },
            onConnect: () => {
                console.log("✅ Connected to Notification WebSocket");
                client.subscribe(`/user/queue/notifications`, (message) => {
                    if (message.body) {
                        const newNotification: Notification = JSON.parse(message.body);
                        handleNewNotification(newNotification);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('❌ Broker reported error:', frame.headers['message']);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (client.active) {
                console.log("🔌 Deactivating Notification WebSocket");
                client.deactivate();
            }
        };
    }, []);

    // 3. Handle Incoming Notification
    const handleNewNotification = (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Visual Toast
        toast(notification.title, {
            description: notification.message,
            action: {
                label: "View",
                onClick: () => window.location.href = '/applicant/dashboard/notifications'
            },
            duration: 6000,
        });
    };

    // 4. Actions
    const markAsRead = async (id: string) => {
        try {
            await api.put(`/api/v1/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put(`/api/v1/notifications/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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