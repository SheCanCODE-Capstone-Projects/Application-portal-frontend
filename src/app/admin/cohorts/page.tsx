"use client";

import React, { useEffect } from "react";
import CohortManagement from "@/app/admin/componets/cohort";
import { useCohorts } from "@/hooks/admin/useCohorts";

export default function CohortsPage() {
    const { cohorts, fetchCohorts } = useCohorts();

    useEffect(() => {
        fetchCohorts();
    }, [fetchCohorts]);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-emerald-900">Program Cohorts</h1>
                <p className="text-zinc-500">Create, update, and monitor academic session limits.</p>
            </header>
            <CohortManagement />
        </div>
    );
}