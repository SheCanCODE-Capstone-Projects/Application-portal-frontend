"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    ChevronDown,
    MoreHorizontal,
    Plus,
    Search,
    UserPlus,
    FileDown,
    Filter,
    Mail,
    Shield,
    Calendar,
    Activity,
    Trash2,
    Edit3
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock Data
type User = {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Applicant" | "Staff";
    status: "Active" | "Inactive" | "Suspended";
    lastActive: string;
};

const data: User[] = [
    { id: "u1", name: "Esther Howard", email: "esther@example.com", role: "Applicant", status: "Active", lastActive: "2 hours ago" },
    { id: "u2", name: "Brooklyn Simmons", email: "brooklyn@example.com", role: "Applicant", status: "Inactive", lastActive: "5 days ago" },
    { id: "u3", name: "Jenny Wilson", email: "jenny@example.com", role: "Admin", status: "Active", lastActive: "Just now" },
    { id: "u4", name: "Wade Warren", email: "wade@example.com", role: "Staff", status: "Active", lastActive: "1 day ago" },
    { id: "u5", name: "Robert Fox", email: "robert@example.com", role: "Applicant", status: "Suspended", lastActive: "1 week ago" },
    { id: "u6", name: "Jane Cooper", email: "jane@example.com", role: "Applicant", status: "Active", lastActive: "10 mins ago" },
];

export default function UsersPage() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

    const columns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="border-slate-500"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="border-slate-500"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="hover:bg-slate-800 text-slate-400">
                    User <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-slate-700">
                        <AvatarFallback className="bg-slate-800 text-slate-300 text-xs">{row.original.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-100">{row.getValue("name")}</span>
                        <span className="text-xs text-slate-500">{row.original.id}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="lowercase text-slate-300">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-slate-400">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span className="text-sm">{row.getValue("role")}</span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none ${
                        status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                            status === 'Inactive' ? 'bg-slate-500/10 text-slate-400' :
                                'bg-rose-500/10 text-rose-400'
                    }`}>
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSelectedUser(row.original); setIsDetailsOpen(true); }}
                        className="bg-white/5 border-slate-700 text-slate-300 hover:bg-white/10 h-8 px-3 text-xs"
                    >
                        Review
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                            <DropdownMenuItem className="hover:bg-slate-800">Edit User</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-slate-800">Change Role</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem className="text-rose-500 hover:bg-rose-500/10">Delete User</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    return (
        <div className="bg-[#0f172a] min-h-screen p-4 sm:p-8 space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-slate-400 text-sm mt-1">Control access, roles, and review platform activity</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700">
                        <FileDown className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                        <UserPlus className="mr-2 h-4 w-4" /> Add New User
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                {/* Action Bar */}
                <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                            placeholder="Search by name or email..."
                            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white h-11 focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-400 h-11 px-4">
                            <Filter className="mr-2 h-4 w-4" /> Filters
                        </Button>
                    </div>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto p-4">
                    <Table>
                        <TableHeader className="bg-slate-900/50 border-slate-800">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-800">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="text-slate-500 font-bold uppercase text-[10px] tracking-widest py-4">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="border-slate-800 hover:bg-slate-800/40 transition-colors">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-40 text-center text-slate-500 italic">No matching users found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} users selected.
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="bg-transparent border-slate-700 text-slate-400">Previous</Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="bg-transparent border-slate-700 text-slate-400">Next</Button>
                    </div>
                </div>
            </div>

            {/* Detailed User Sheet */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="bg-[#0f172a] border-slate-800 text-white sm:max-w-md p-0 overflow-y-auto">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 w-full" />
                    <div className="px-6 -mt-12">
                        <SheetHeader className="mb-8 items-center text-center">
                            <Avatar className="h-24 w-24 border-4 border-[#0f172a] shadow-xl">
                                <AvatarFallback className="bg-slate-800 text-2xl font-bold">{selectedUser?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="mt-4">
                                <SheetTitle className="text-white text-2xl font-bold">{selectedUser?.name}</SheetTitle>
                                <SheetDescription className="text-blue-400 font-medium uppercase text-[10px] tracking-widest mt-1">
                                    System {selectedUser?.role}
                                </SheetDescription>
                            </div>
                        </SheetHeader>

                        <div className="space-y-8 pb-10">
                            <section className="space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Activity size={14} /> Information Overview
                                </h4>
                                <div className="space-y-4 bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Email</span>
                                        <span className="text-slate-200">{selectedUser?.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Status</span>
                                        <span className="text-emerald-400 font-bold">{selectedUser?.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Last Active</span>
                                        <span className="text-slate-300">{selectedUser?.lastActive}</span>
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-col gap-3">
                                <Button className="bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl font-bold">Edit Permissions</Button>
                                <Button variant="outline" className="border-slate-700 text-slate-400 h-12 rounded-xl">Deactivate User</Button>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}