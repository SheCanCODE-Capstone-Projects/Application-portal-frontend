"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type WebSocketMessageType = 
    | "APPLICATION_UPDATE"
    | "STATS_UPDATE"
    | "NOTIFICATION"
    | "STATUS_CHANGE"
    | "NEW_APPLICATION"
    | "COHORT_UPDATE";

export interface WebSocketMessage<T = unknown> {
    type: WebSocketMessageType;
    payload?: T;
    timestamp?: string;
}

interface WebSocketOptions {
    url?: string;
    onMessage?: (data: WebSocketMessage) => void;
    onError?: (error: Event) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    reconnectInterval?: number;
    maxRetries?: number;
    autoConnect?: boolean;
}

export function useWebSocket({
    url,
    onMessage,
    onError,
    onConnect,
    onDisconnect,
    reconnectInterval = 5000,
    maxRetries = 10,
    autoConnect = true,
}: WebSocketOptions = {}) {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const onMessageRef = useRef(onMessage);
    const onErrorRef = useRef(onError);
    const onConnectRef = useRef(onConnect);
    const onDisconnectRef = useRef(onDisconnect);

    // Update refs when callbacks change
    useEffect(() => {
        onMessageRef.current = onMessage;
        onErrorRef.current = onError;
        onConnectRef.current = onConnect;
        onDisconnectRef.current = onDisconnect;
    }, [onMessage, onError, onConnect, onDisconnect]);

    // Get token for authenticated WebSocket
    const getAuthToken = () => localStorage.getItem("access_token");

    // Default to a websocket URL, potentially from env
    const socketUrl = url || process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

    const connect = useCallback(() => {
        if (!socketUrl) return;

        // Prevent multiple connections
        if (wsRef.current?.readyState === WebSocket.OPEN || 
            wsRef.current?.readyState === WebSocket.CONNECTING) {
            return;
        }

        // Check max retries
        if (retryCount >= maxRetries) {
            setConnectionError(`Max reconnection attempts (${maxRetries}) reached`);
            return;
        }

        try {
            // Add auth token as query param if available
            const token = getAuthToken();
            const wsUrl = token ? `${socketUrl}?token=${token}` : socketUrl;

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                setConnectionError(null);
                setRetryCount(0);
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
                onConnectRef.current?.();
            };

            ws.onmessage = (event) => {
                try {
                    const data: WebSocketMessage = JSON.parse(event.data);
                    setLastMessage(data);
                    onMessageRef.current?.(data);
                } catch (err) {
                    console.error("Failed to parse WebSocket message:", err);
                }
            };

            ws.onclose = (event) => {
                setIsConnected(false);
                wsRef.current = null;
                onDisconnectRef.current?.();

                // Don't reconnect if closed cleanly (code 1000) or max retries reached
                if (event.code !== 1000 && retryCount < maxRetries) {
                    setRetryCount(prev => prev + 1);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket Error:", error);
                setConnectionError("Connection error occurred");
                onErrorRef.current?.(error);
                ws.close();
            };
        } catch (err) {
            console.error("Failed to create WebSocket:", err);
            setConnectionError("Failed to create WebSocket connection");
        }
    }, [socketUrl, reconnectInterval, maxRetries, retryCount]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close(1000, "Client disconnect");
            wsRef.current = null;
        }
        setIsConnected(false);
        setRetryCount(0);
    }, []);

    const reconnect = useCallback(() => {
        disconnect();
        setRetryCount(0);
        setConnectionError(null);
        setTimeout(connect, 100);
    }, [disconnect, connect]);

    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    const sendMessage = useCallback((message: WebSocketMessage | object) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
            return true;
        } else {
            console.warn("WebSocket is not connected");
            return false;
        }
    }, []);

    return {
        isConnected,
        lastMessage,
        connectionError,
        retryCount,
        sendMessage,
        connect,
        disconnect,
        reconnect,
    };
}
