// src/components/admin/AdminHeader.tsx
"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
    const { logout, user } = useAuth();

    return (
        <header className="flex h-20 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-6 md:px-12 shadow-sm">
            <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-bold text-emerald-900">Portal Overview</h1>
                <p className="hidden sm:block text-zinc-500 text-xs">Manage applications and cohort system status.</p>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Global Settings */}
                <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50">
                    <Settings size={20} />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                </Button>

                <div className="h-8 w-px bg-zinc-200 mx-2"></div>

                {/* Profile & Logout Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 p-1 rounded-full hover:bg-zinc-50 transition-colors">
                            <Avatar className="h-9 w-9 border border-emerald-100 shadow-sm">
                                <AvatarImage src="/images/admin-avatar.png" alt="Admin" />
                                <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold">AD</AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold text-emerald-900 leading-none">Admin User</p>
                                <p className="text-[10px] text-zinc-500 uppercase mt-1">Super Admin</p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}