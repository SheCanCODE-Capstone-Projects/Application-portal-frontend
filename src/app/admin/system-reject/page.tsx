"use client";

import React, { useEffect } from "react";
import { useAdminApplications } from "@/hooks/admin/useAdminApplications";
import SystemRejects from "@/app/admin/componets/systemRejects";

export default function RejectsPage() {
    const { fetchApplications } = useAdminApplications();

    useEffect(() => {
        // Fetch specific system-rejected status from backend
        fetchApplications({ status: "SYSTEM_REJECTED" });
    }, [fetchApplications]);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-rose-800">Automated Rejections</h1>
                <p className="text-zinc-500">Logs of applicants who did not meet automatic screening criteria.</p>
            </header>
            <SystemRejects />
        </div>
    );
}