// src/components/admin/Sidebar.tsx
'use client';

import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    UsersIcon,
    ChartBarIcon,
    CogIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Users', href: '/admin/dashboard/users', icon: UsersIcon },
    { name: 'Reports', href: '/admin/dashboard/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/dashboard/settings', icon: CogIcon },
    { name: 'Logout', href: '/api/auth/logout', icon: ArrowLeftOnRectangleIcon, external: true },
];

export default function Sidebar({
                                    sidebarOpen,
                                    setSidebarOpen,
                                }: {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-black transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}
            >
                <div className="flex h-full flex-col">
                    {/* Logo / Brand */}
                    <div className="flex h-16 items-center justify-center bg-white">
                        <span className="text-xl font-bold text-black">Admin Dashboard</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6">
                        <ul className="space-y-2">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <li key={item.name}>
                                        {item.external ? (
                                            <a
                                                href={item.href}
                                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                                                    isActive
                                                        ? 'bg-orange-500'
                                                        : 'hover:bg-orange-400 hover:bg-opacity-80'
                                                }`}
                                            >
                                                <Icon className="h-5 w-5" aria-hidden="true" />
                                                {item.name}
                                            </a>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                                                    isActive
                                                        ? 'bg-orange-500'
                                                        : 'hover:bg-orange-400 hover:bg-opacity-80'
                                                }`}
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <Icon className="h-5 w-5" aria-hidden="true" />
                                                {item.name}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}