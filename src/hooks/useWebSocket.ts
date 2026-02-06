"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface WebSocketMessage {
    type: string;
    payload?: unknown;
}

interface UseWebSocketOptions {
    onMessage?: (message: WebSocketMessage) => void;
}

interface UseWebSocketReturn {
    clientRef: React.RefObject<Client | null>;
    isConnected: boolean;
    subscribe: (destination: string, callback: (message: any) => void) => () => void;
}

export function useWebSocket({ onMessage }: UseWebSocketOptions = {}): UseWebSocketReturn {
    const clientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const subscribe = useCallback((destination: string, callback: (message: any) => void) => {
        if (!clientRef.current || !clientRef.current.connected) {
            return () => { };
        }

        const subscription = clientRef.current.subscribe(destination, (message) => {
            try {
                const body = JSON.parse(message.body);
                callback(body);
            } catch (e) {
                console.error("Failed to parse message", e);
            }
        });

        return () => subscription.unsubscribe();
    }, [isConnected]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        // FIX: Match variable name and Handle Mixed Content
        let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

        // Remove trailing slashes
        baseUrl = baseUrl.replace(/\/+$/, '');

        // If the page is loaded over HTTPS, ensure the WebSocket connects over HTTPS
        if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
            baseUrl = baseUrl.replace(/^http:\/\//i, 'https://');
        }

        const socket = new SockJS(`${baseUrl}/ws`);

        const stompClient = new Client({
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

        stompClient.onConnect = () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
            if (onMessage) {
                stompClient.subscribe("/user/queue/notifications", (message) => {
                    try {
                        const body = JSON.parse(message.body);
                        onMessage({ type: "NOTIFICATION", payload: body });
                    } catch (e) {
                        console.error("Failed to parse message", e);
                    }
                });
            }
        };

        stompClient.onStompError = (frame) => {
            console.error("STOMP error", frame);
        };

        stompClient.onDisconnect = () => {
            setIsConnected(false);
        };

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [onMessage]);

    return { clientRef, isConnected, subscribe };
}