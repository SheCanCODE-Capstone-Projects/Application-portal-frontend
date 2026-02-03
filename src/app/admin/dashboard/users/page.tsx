"use client";

import { useEffect, useState } from 'react';
import { adminService, UserResponseDto } from '@/services/admin/admin-service';
import { Search, Trash2, Eye, Shield, Download, MoreHorizontal, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function UsersPage() {
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const fetchUsers = async () => {
        const token = localStorage.getItem("access_token");
        if(!token) {
            setLoading(false); // Stop loading if no token
            return;
        }

        try {
            setLoading(true);
            const response: any = await adminService.getAllUsers(token);
            console.log("Raw API Response:", response); // Check console for this

            let dataArray: UserResponseDto[] = [];

            // 1. Direct Array (Your case likely)
            if (Array.isArray(response)) {
                dataArray = response;
            }
            // 2. Nested in data property (Axios default)
            else if (response?.data && Array.isArray(response.data)) {
                dataArray = response.data;
            }
            // 3. Nested in users property
            else if (response?.users && Array.isArray(response.users)) {
                dataArray = response.users;
            }

            console.log("Processed Data Array:", dataArray);
            setUsers(dataArray);
        } catch(e) {
            console.error("Fetch Error:", e);
            toast.error("Failed to fetch users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id: string) => {
        if(!confirm("Are you sure you want to deactivate this user?")) return;
        const token = localStorage.getItem("access_token");
        if(!token) return;
        try {
            await adminService.deleteUser(token, id);
            toast.success("User deactivated");
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch(e) { toast.error("Action failed"); }
    };

    const filtered = users.filter(u =>
        (u.username?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (u.email?.toLowerCase() || "").includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Total Users: {users.length}</p>
                </div>
                <Button variant="outline" onClick={fetchUsers} title="Refresh">
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </Button>
            </div>

            <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100 bg-white pb-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            className="pl-9"
                            placeholder="Search users..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-gray-500 font-semibold uppercase text-xs">
                            <tr>
                                <th className="p-4 pl-6">User Profile</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Cohort</th>
                                <th className="p-4">Joined Date</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center">Loading users...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td></tr>
                            ) : (
                                filtered.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-gray-200">
                                                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                                        {user.username?.charAt(0).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.username}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline" className={user.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-none' : 'bg-gray-100'}>
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            {user.cohortName || <span className="text-gray-400 italic">No Cohort</span>}
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsDetailsOpen(true); }}>
                                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="bg-emerald-600 text-white text-xl">
                                        {selectedUser.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-lg">{selectedUser.username}</h3>
                                    <p className="text-gray-500">{selectedUser.email}</p>
                                    <p className="text-xs text-gray-400">ID: {selectedUser.id}</p>
                                </div>
                            </div>
                            {/* Additional details here if needed */}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}