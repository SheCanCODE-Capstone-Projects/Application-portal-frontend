"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bell,
    Search,
    CheckCheck,
    Trash2,
    MailOpen,
    Mail,
    Clock,
    Circle,
    MoreHorizontal,
    Filter
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data based on NotificationDto
const initialNotifications = [
    {
        id: "1",
        title: "New Application",
        message: "Tabitha Kunda has submitted a new application for Cohort 4.",
        isRead: false,
        createdAt: "2026-01-28T09:00:00",
        type: "system"
    },
    {
        id: "2",
        title: "System Update",
        message: "The application portal will undergo maintenance tonight at 11 PM.",
        isRead: true,
        createdAt: "2026-01-27T14:30:00",
        type: "alert"
    },
    {
        id: "3",
        title: "Interview Scheduled",
        message: "An interview has been scheduled for Aurore Ineza.",
        isRead: false,
        createdAt: "2026-01-28T10:15:00",
        type: "user"
    },
];

export default function Notify() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Filter Logic
    const filteredNotifications = notifications.filter((n) => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" ||
            (statusFilter === "Unread" ? !n.isRead : n.isRead);
        return matchesSearch && matchesStatus;
    });

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    return (
        <div className="bg-[#0f172a] min-h-screen p-4 sm:p-8 space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Bell className="text-blue-500" /> Notifications
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage system alerts and applicant updates</p>
                </div>
                <Button
                    onClick={markAllAsRead}
                    variant="outline"
                    className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 h-11"
                >
                    <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
                </Button>
            </div>

            {/* Content Card */}
            <Card className="bg-[#1e293b] border-none text-white shadow-2xl overflow-hidden">
                {/* Action Bar */}
                <div className="p-6 border-b border-slate-800/50 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white h-11 focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-white h-11">
                                <Filter className="mr-2 h-4 w-4 text-slate-500" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                <SelectItem value="All">All Notifications</SelectItem>
                                <SelectItem value="Unread">Unread Only</SelectItem>
                                <SelectItem value="Read">Read Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Notifications Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-900/50 border-slate-800">
                            <TableRow className="hover:bg-transparent border-slate-800">
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest py-4 w-[40px]"></TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest py-4">Notification</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest py-4">Date</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest py-4">Status</TableHead>
                                <TableHead className="text-right text-slate-500 font-bold uppercase text-[10px] tracking-widest py-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map((n) => (
                                    <TableRow
                                        key={n.id}
                                        className={`border-slate-800 hover:bg-slate-800/40 transition-colors ${!n.isRead ? 'bg-blue-500/[0.02]' : ''}`}
                                    >
                                        <TableCell className="py-4">
                                            {!n.isRead && (
                                                <Circle className="h-2 w-2 fill-blue-500 text-blue-500 animate-pulse" />
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col gap-1 max-w-md">
                                                <span className={`text-sm font-bold ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                                                    {n.title}
                                                </span>
                                                <span className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                    {n.message}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                <Clock className="h-3 w-3" />
                                                {new Date(n.createdAt).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border-none ${
                                                n.isRead ? 'bg-slate-500/10 text-slate-500' : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                                {n.isRead ? 'Read' : 'Unread'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {!n.isRead && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => markAsRead(n.id)}
                                                        className="text-blue-400 hover:bg-blue-400/10 h-8 px-3 text-xs"
                                                    >
                                                        <MailOpen className="h-3 w-3 mr-2" /> Mark Read
                                                    </Button>
                                                )}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                                                        <DropdownMenuItem className="hover:bg-slate-800 flex gap-2">
                                                            <Mail className="h-4 w-4" /> View Message
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-500 hover:bg-rose-500/10 flex gap-2">
                                                            <Trash2 className="h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center text-slate-500 italic">
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