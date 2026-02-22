import { useState, useEffect } from 'react';
import { adminService } from '@/services/admin/admin-service';
import { PaginatedResponse, SynchronizedUser } from '@/types/user/user';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useSynchronizedUsers = () => {
    const [data, setData] = useState<PaginatedResponse<SynchronizedUser> | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) return;

            try {
                setLoading(true);
                const res = await adminService.getSynchronizedUsers(token, page, size);
                setData(res);
            } catch (error) {
                const err = error as AxiosError<{ message: string }>;
                const message = err.response?.data?.message || err.message || "Failed to load synchronized users";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page, size]);

    return { data, loading, page, setPage, size, setSize };
};