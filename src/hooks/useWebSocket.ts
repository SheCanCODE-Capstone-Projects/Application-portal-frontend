"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface WebSocketOptions {
    url?: string;
    onMessage?: (data: any) => void;
    reconnectInterval?: number;
}

export function useWebSocket({ url, onMessage, reconnectInterval = 5000 }: WebSocketOptions = {}) {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Default to a websocket URL, potentially from env
    const socketUrl = url || process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

    const connect = useCallback(() => {
        if (!socketUrl) return;

        // prevents multiple connections
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        console.log("Connecting to WebSocket:", socketUrl);
        const ws = new WebSocket(socketUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket Connected");
            setIsConnected(true);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLastMessage(data);
                if (onMessage) {
                    onMessage(data);
                }
            } catch (err) {
                console.error("Failed to parse WebSocket message", err);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket Disconnected");
            setIsConnected(false);
            wsRef.current = null;
            // Attempt reconnect
            reconnectTimeoutRef.current = setTimeout(() => {
                connect();
            }, reconnectInterval);
        };

        ws.onerror = (error) => {
            console.error("WebSocket Error:", error);
            ws.close();
        };

    }, [socketUrl, onMessage, reconnectInterval]);

    useEffect(() => {
        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    const sendMessage = (message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not connected");
        }
    };

    return { isConnected, lastMessage, sendMessage };
}
