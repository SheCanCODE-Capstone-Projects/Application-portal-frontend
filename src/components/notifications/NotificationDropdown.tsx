"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/notification/useNotifications";
import { Bell, Check, CheckCheck, Loader2, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";
import { Notification } from "@/services/notification/notification-service";

export function NotificationDropdown() {
    const { 
        notifications, 
        unreadCount, 
        loading, 
        fetchNotifications, 
        fetchUnreadCount,
        markAsRead, 
        markAllAsRead 
    } = useNotifications();
    
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchUnreadCount();
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications, fetchUnreadCount]);

    const getNotificationIcon = (type: Notification["type"]) => {
        switch (type) {
            case "SUCCESS":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "ERROR":
                return <XCircle className="w-5 h-5 text-red-500" />;
            case "WARNING":
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Panel */}
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="max-h-96 overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : notifications.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => !notification.read && markAsRead(notification.id)}
                                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                !notification.read ? "bg-green-50/50" : ""
                                            }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${!notification.read ? "font-semibold" : ""} text-gray-900`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatTime(notification.createdAt)}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="flex-shrink-0">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Bell className="w-10 h-10 mb-2" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="border-t border-gray-100 px-4 py-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
