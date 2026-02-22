"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Search, CheckCheck, Trash2, MailOpen, Clock, Circle, Filter, Loader2,
} from "lucide-react";
import { toast } from "sonner";

import {
    adminNotificationService,
    AdminNotification,
} from "@/services/notification/notification-service";

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const getToken = () => localStorage.getItem("access_token") ?? "";

    const fetchNotifications = async () => {
        const token = getToken();
        if (!token) return;
        try {
            setLoading(true);
            const data = await adminNotificationService.getAll(token);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const filteredNotifications = notifications.filter((n) => {
        const matchesSearch =
            (n.title?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
            (n.message?.toLowerCase() ?? "").includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            (statusFilter === "Unread" ? !n.read : n.read);

        return matchesSearch && matchesStatus;
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = async (id: string) => {
        const token = getToken();
        if (!token) return;
        try {
  
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            await adminNotificationService.markAsRead(id, token);
            toast.success("Marked as read");
        } catch {
            toast.error("Failed to update status");
            fetchNotifications(); 
        }
    };

    const markAllAsRead = async () => {
        const token = getToken();
        if (!token) return;
        try {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            await adminNotificationService.markAllAsRead(token);
            toast.success("All notifications marked as read");
        } catch {
            toast.error("Action failed");
            fetchNotifications();
        }
    };

    // ── Type badge colour ─────────────────────────────────────────────────────
    const getTypeStyle = (type?: string) => {
        switch (type?.toUpperCase()) {
            case "APPLICATION_ACCEPTED":    return "text-green-600 bg-green-50 border-green-100";
            case "APPLICATION_REJECTED":    return "text-red-500 bg-red-50 border-red-100";
            case "APPLICATION_SUBMITTED":   return "text-blue-600 bg-blue-50 border-blue-100";
            case "INTERVIEW_SCHEDULED":     return "text-purple-600 bg-purple-50 border-purple-100";
            case "ADMIN_DAILY_SUMMARY":     return "text-orange-500 bg-orange-50 border-orange-100";
            default:                        return "text-gray-500 bg-gray-50 border-gray-100";
        }
    };

    const formatType = (type?: string) =>
        type?.replace(/_/g, " ") ?? "GENERAL";

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {unreadCount > 0
                            ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                            : "All caught up"}
                    </p>
                </div>
                <Button
                    onClick={markAllAsRead}
                    variant="outline"
                    className="bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                    disabled={loading || unreadCount === 0}
                >
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Mark all as read
                </Button>
            </div>

            <Card className="border-gray-200 shadow-sm">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4 bg-white rounded-t-xl">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-50 border-gray-200 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[140px] bg-white border-gray-200">
                                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="Unread">Unread</SelectItem>
                                <SelectItem value="Read">Read</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="border-gray-100">
                                <TableHead className="w-[36px]" />
                                <TableHead className="font-semibold text-gray-600">Notification</TableHead>
                                <TableHead className="font-semibold text-gray-600">Date Received</TableHead>
                                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                                <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                                            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                                            <p>Loading notifications...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredNotifications.length > 0 ? (
                                filteredNotifications.map((n) => (
                                    <TableRow
                                        key={n.id}
                                        className={`border-gray-100 transition-colors hover:bg-gray-50/50 ${
                                            !n.read ? "bg-blue-50/30" : ""
                                        }`}
                                    >
                                        {/* Unread dot */}
                                        <TableCell>
                                            {!n.read && (
                                                <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
                                            )}
                                        </TableCell>

                                        {/* Title + message + type */}
                                        <TableCell className="py-4">
                                            <div className="flex flex-col gap-1 max-w-lg">
                                                <span
                                                    className={`text-sm ${
                                                        !n.read
                                                            ? "font-bold text-gray-900"
                                                            : "font-medium text-gray-600"
                                                    }`}
                                                >
                                                    {n.title}
                                                </span>
                                                <span className="text-xs text-gray-500 line-clamp-2">
                                                    {n.message}
                                                </span>
                                                {n.type && (
                                                    <span
                                                        className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded w-fit mt-1 border ${getTypeStyle(n.type)}`}
                                                    >
                                                        {formatType(n.type)}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                {new Date(n.createdAt).toLocaleDateString()}
                                                <span className="hidden sm:inline">
                                                    at{" "}
                                                    {new Date(n.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Read / Unread badge */}
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`border-none ${
                                                    n.read
                                                        ? "bg-gray-100 text-gray-500"
                                                        : "bg-blue-100 text-blue-600 font-bold"
                                                }`}
                                            >
                                                {n.read ? "Read" : "New"}
                                            </Badge>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {!n.read && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => markAsRead(n.id)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2"
                                                        title="Mark as Read"
                                                    >
                                                        <MailOpen className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-40 text-center text-gray-500 italic"
                                    >
                                        No notifications found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}