"use client";

import React, { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { Notification } from "@/services/notification/notification-service";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Bell, CheckCheck, ChevronDown, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        loading,
    } = useNotifications();

    const [expandedNotification, setExpandedNotification] = useState<string | null>(null);

    // Expand one by one, automatically marking as read
    const handleToggleNotification = async (id: string, isRead: boolean) => {
        if (expandedNotification === id) {
            setExpandedNotification(null); // Collapse if already open
        } else {
            setExpandedNotification(id); // Expand clicked notification
            if (!isRead) {
                await markAsRead(id);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col gap-4 items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-green-600" />
                <p className="text-gray-500 font-medium">Fetching messages...</p>
            </div>
        );
    }

    // Completely separate into two lists
    const unreadList = notifications.filter(n => !n.read);
    const readList = notifications.filter(n => n.read);

    const renderNotificationItem = (notification: Notification, isUnread: boolean) => {
        const isExpanded = expandedNotification === notification.id;

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={notification.id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isExpanded ? "border-green-400 shadow-md ring-1 ring-green-100" : "border-gray-200 shadow-sm hover:border-gray-300"
                }`}
            >
                {/* Clickable Header */}
                <div
                    onClick={() => handleToggleNotification(notification.id, notification.read)}
                    className={`p-5 cursor-pointer flex items-center justify-between gap-4 transition-colors ${
                        isUnread ? "bg-blue-50/40" : "bg-white"
                    }`}
                >
                    <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1.5 flex-shrink-0">
                            {isUnread ? (
                                <span className="block h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                            ) : (
                                <span className="block h-2 w-2 rounded-full bg-gray-300" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-base ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>
                                {notification.title}
                            </h3>
                            <p className={`text-xs mt-1 ${isUnread ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                                {isUnread ? "New • " : ""} Received {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <div className={`flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180 text-green-600" : "text-gray-400"}`}>
                        <ChevronDown size={20} />
                    </div>
                </div>

                {/* Expandable Details Body */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="p-6 pt-5 border-t border-gray-100 bg-gray-50/30">
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                                    {notification.message}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 mx-auto">
            <div className="">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            Notifications
                        </h1>
                        <p className="text-gray-600 mt-1">
                            You have {unreadCount} unread notification{unreadCount !== 1 && "s"}
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-medium transition"
                        >
                            <CheckCheck size={16} className="text-green-600"/>
                            <span className="hidden sm:inline">Mark all read</span>
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {notifications.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-16 text-center mt-4">
                        <div className="bg-gray-50 p-6 rounded-full w-fit mx-auto mb-6">
                            <Bell className="text-gray-300" size={48} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            You&#39;re all caught up
                        </h2>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                            When something important happens regarding your application, it will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* 1. UNREAD SECTION */}
                        {unreadList.length > 0 && (
                            <motion.div layout className="space-y-4">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2 px-1">
                                    <Bell className="w-5 h-5 text-blue-600" />
                                    New Notifications
                                </h2>
                                <div className="space-y-3">
                                    {unreadList.map((notification) => renderNotificationItem(notification, true))}
                                </div>
                            </motion.div>
                        )}

                        {/* 2. READ HISTORY SECTION */}
                        {readList.length > 0 && (
                            <motion.div layout className="space-y-4">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2 px-1 border-t border-gray-200 pt-8">
                                    <CheckCircle2 className="w-5 h-5 text-gray-400" />
                                    Read History
                                </h2>
                                <div className="space-y-3">
                                    {readList.map((notification) => renderNotificationItem(notification, false))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}