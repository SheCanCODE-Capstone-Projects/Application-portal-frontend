"use client";

import Application from "@/app/admin/componets/Application";

export default function ApplicationsPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-emerald-900">Application Pipeline</h1>
                <p className="text-zinc-500">Review and manage the end-to-end recruitment process.</p>
            </header>
            <Application />
        </div>
    );
}