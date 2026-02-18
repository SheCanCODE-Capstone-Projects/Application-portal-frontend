"use client";

import { useEffect, useState, useMemo } from 'react';
import { adminService, UserResponseDto } from '@/services/admin/admin-service';
import { Search, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,  DropdownMenuSeparator, DropdownMenuTrigger,
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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchUsers = async () => {
        const token = localStorage.getItem("access_token");
        if(!token) { setLoading(false); return; }

        try {
            setLoading(true);
            const response: any = await adminService.getAllUsers(token);

            let dataArray: UserResponseDto[] = [];
            if (Array.isArray(response)) dataArray = response;
            else if (response?.data && Array.isArray(response.data)) dataArray = response.data;
            else if (response?.users && Array.isArray(response.users)) dataArray = response.users;

            setUsers(dataArray);
        } catch(e) {
            console.error("Fetch Error:", e);
            toast.error("Failed to fetch users");
            setUsers([]);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    // Reset page when search changes
    useEffect(() => { setCurrentPage(1); }, [search]);

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

    // Filter users based on search
    const filtered = useMemo(() =>
        users.filter(u =>
            (u.username?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (u.email?.toLowerCase() || "").includes(search.toLowerCase())
        ), [users, search]
    );

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedUsers = useMemo(() =>
        filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
        [filtered, currentPage]
    );

    const goToPage = (page: number) => {
        if(page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-500">Total Users: {users.length}</p>
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
                                ) : paginatedUsers.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td></tr>
                                ) : (
                                    paginatedUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 pl-6 flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-gray-200">
                                                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                                        {user.username?.charAt(0).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.username}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className={user.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-none' : 'bg-gray-100'}>
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">{user.cohortName || <span className="text-gray-400 italic">No Cohort</span>}</td>
                                            <td className="p-4 text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
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

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-end items-center gap-2 p-4">
                            <Button size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Prev</Button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <Button
                                    key={page}
                                    size="sm"
                                    variant={page === currentPage ? 'default' : 'outline'}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}

                            <Button size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Details Dialog */}
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
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
