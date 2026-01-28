// src/app/applicant/layout.tsx
"use client";
import { ReactNode } from "react";
import ApplicantGuard from "./ApplicantGuard";

export default function ApplicantLayout({ children }: { children: ReactNode }) {
    return (
        <ApplicantGuard>
            {children}
        </ApplicantGuard>
    );
}