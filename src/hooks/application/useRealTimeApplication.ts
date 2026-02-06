"use client";

import { useEffect, useState, useCallback } from "react";
// import { useWebSocket } from "@/hooks/useWebSocket"; // 1. Comment out import to fix SecurityError
import { applicationService } from "@/services/application/application-service";
import { Application } from "@/types/application/application";

export function useRealTimeApplication(userId: string | undefined) {
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    // const { subscribe } = useWebSocket(); // 2. Comment out hook usage

    const fetchApp = useCallback(async () => {
        // 3. FIX: Add this line. It forces the function to pause briefly,
        // ensuring 'setLoading' is always called asynchronously.
        await Promise.resolve();

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
        // fetchApp();
    }, [fetchApp]);

    // 4. Comment out the WebSocket useEffect to prevent SecurityError
    /*
    useEffect(() => {
        if (!userId) return;

        // Subscribing to real-time progress updates sent by backend:
        const unsubProgress = subscribe(`/topic/progress/${userId}`, (update: { progress: number }) => {
            setApplication(prev => prev ? { ...prev, progress: update.progress } : null);
        });

        // Subscribing to user-specific status updates (Accepted/Rejected/Submitted)
        const unsubStatus = subscribe(`/user/queue/notifications`, () => {
            fetchApp(); // Refresh full application state when a notification arrives
        });

        return () => { unsubProgress(); unsubStatus(); };
    }, [userId, subscribe, fetchApp]);
    */

    return { application, loading, refresh: fetchApp };
}