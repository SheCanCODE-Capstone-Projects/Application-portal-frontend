'use client';

import { useNotifications } from '@/context/NotificationContext';
import { Bell, Check, MailOpen } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10">
                    <Bell className="h-6 w-6 text-gray-600" />

                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3 bg-gray-50/50">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAllAsRead()}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                            <Check className="h-3 w-3" /> Mark all read
                        </button>
                    )}
                </div>
                <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
                            <MailOpen className="h-8 w-8 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "flex flex-col gap-1 p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer relative",
                                        !notification.read && "bg-blue-50/40"
                                    )}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    {!notification.read && (
                                        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500" />
                                    )}
                                    <h5 className={cn("text-sm", !notification.read ? "font-bold text-gray-900" : "font-medium text-gray-600")}>
                                        {notification.title}
                                    </h5>
                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                        {notification.message}
                                    </p>
                                    <span className="text-[10px] text-gray-400 mt-1">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 border-t text-center">
                    <a href="/applicant/dashboard/notifications" className="text-xs text-gray-500 hover:text-gray-900 font-medium">
                        View All History
                    </a>
                </div>
            </PopoverContent>
        </Popover>
    );
}