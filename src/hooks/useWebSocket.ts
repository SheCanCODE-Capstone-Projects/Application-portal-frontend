"use client";

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface WebSocketMessage {
    type: string;
    payload?: any;
}

interface UseWebSocketOptions {
    onMessage: (message: WebSocketMessage) => void;
}

export function useWebSocket({ onMessage }: UseWebSocketOptions) {
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        // Use SockJS client matching backend configuration
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/ws`);

        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                if (process.env.NODE_ENV === 'development') console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket");

            // Subscribe to user-specific notifications
            // Backend typically sends to /user/queue/notifications based on your config
            client.subscribe("/user/queue/notifications", (message) => {
                try {
                    const body = JSON.parse(message.body);
                    onMessage({ type: "NOTIFICATION", payload: body });
                } catch (e) {
                    console.error("Failed to parse message", e);
                }
            });
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [onMessage]);

    return clientRef.current;
}