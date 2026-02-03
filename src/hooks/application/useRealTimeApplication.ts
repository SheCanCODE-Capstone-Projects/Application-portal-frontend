"use client";

import { useEffect, useState, useCallback } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { applicationService } from "@/services/application/application-service";
import { Application } from "@/types/application/application";

export function useRealTimeApplication(userId: string | undefined) {
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const { subscribe } = useWebSocket();

    const fetchApp = useCallback(async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const data = await applicationService.getMyApplication(token);
                setApplication(data);
            } catch (err: unknown) {
                console.error("Dashboard fetch error", err);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchApp();
    }, [fetchApp]);

    useEffect(() => {
        if (!userId) return;

        // Subscribing to real-time progress updates sent by backend:
        // com.igirerwanda.application_portal_backend.notification.service.WebSocketService.broadcastApplicationProgress
        const unsubProgress = subscribe(`/topic/progress/${userId}`, (update: { progress: number }) => {
            setApplication(prev => prev ? { ...prev, progress: update.progress } : null);
        });

        // Subscribing to user-specific status updates (Accepted/Rejected/Submitted)
        const unsubStatus = subscribe(`/user/queue/notifications`, () => {
            fetchApp(); // Refresh full application state when a notification arrives
        });

        return () => { unsubProgress(); unsubStatus(); };
    }, [userId, subscribe, fetchApp]);

    return { application, loading, refresh: fetchApp };
}