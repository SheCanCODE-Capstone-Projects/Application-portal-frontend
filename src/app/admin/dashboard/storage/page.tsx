"use client";

import React, { useEffect, useState } from "react";
import { Folder, HardDrive, Loader2, ChevronRight, FileSpreadsheet, Download, } from "lucide-react";
import { api } from "@/lib/api/api";


export default function StoragePage() {
    const [storageData, setStorageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Google Drive Navigation State
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedCohort, setSelectedCohort] = useState<string | null>(null);

    useEffect(() => {
        const fetchStorage = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const res = await api.get("/api/v1/admin/applications/storage", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStorageData(res.data.data.storageTree);
            } catch (err) {
                console.error("Failed to fetch storage tree", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStorage();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
                <p className="text-gray-500 font-medium">Connecting to Master Storage...</p>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        if (status.includes("ACCEPTED")) return "bg-green-100 text-green-800";
        if (status.includes("REJECTED")) return "bg-red-100 text-red-800";
        return "bg-blue-100 text-blue-800";
    };

    // Helper to render a Google Drive style folder
    const FolderCard = ({ label, subtitle, onClick, colorClass = "text-blue-500", fillClass = "fill-blue-500" }: any) => (
        <div
            onClick={onClick}
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 cursor-pointer shadow-sm transition-all group"
        >
            <div className={`p-3 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform ${colorClass}`}>
                <Folder className={`w-8 h-8 ${fillClass}`} />
            </div>
            <div>
                <h3 className="font-semibold text-gray-800 text-base">{label}</h3>
                <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-2 mx-auto animate-in fade-in duration-500">

            {/* 1. Google Drive Interface */}
            <div>
                {/* Header & Breadcrumbs */}
                <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <button
                            onClick={() => { setSelectedYear(null); setSelectedCohort(null); }}
                            className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors ${!selectedYear ? "text-blue-600 font-bold" : ""}`}
                        >
                            <HardDrive size={18} /> Storage Drive
                        </button>

                        {selectedYear && (
                            <>
                                <ChevronRight size={16} className="text-gray-400" />
                                <button
                                    onClick={() => setSelectedCohort(null)}
                                    className={`hover:text-blue-600 transition-colors ${!selectedCohort ? "text-blue-600 font-bold" : ""}`}
                                >
                                    {selectedYear}
                                </button>
                            </>
                        )}

                        {selectedCohort && (
                            <>
                                <ChevronRight size={16} className="text-gray-400" />
                                <span className="text-gray-900 font-bold flex items-center gap-1.5">
                                    <FileSpreadsheet size={16} className="text-emerald-600" />
                                    {selectedCohort}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Action Button (e.g. Export) */}
                    {selectedCohort && (
                        <button className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-emerald-200">
                            <Download size={16} /> Export to Excel
                        </button>
                    )}
                </div>

                {/* Folder Grid View: Show Years */}
                {!selectedYear && storageData && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.keys(storageData).sort().reverse().map((year) => (
                            <FolderCard
                                key={year}
                                label={`Archive ${year}`}
                                subtitle={`${Object.keys(storageData[year]).length} Cohorts`}
                                colorClass="text-indigo-500"
                                fillClass="fill-indigo-500"
                                onClick={() => setSelectedYear(year)}
                            />
                        ))}
                    </div>
                )}

                {/* Folder Grid View: Show Cohorts within a selected Year */}
                {selectedYear && !selectedCohort && storageData[selectedYear] && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.keys(storageData[selectedYear]).map((cohort) => (
                            <FolderCard
                                key={cohort}
                                label={cohort}
                                subtitle={`${storageData[selectedYear][cohort].length} Applications`}
                                colorClass="text-emerald-500"
                                fillClass="fill-emerald-500"
                                onClick={() => setSelectedCohort(cohort)}
                            />
                        ))}
                    </div>
                )}

                {/* 3. Excel Spreadsheet View: Show Applications inside a Cohort */}
                {selectedYear && selectedCohort && storageData[selectedYear][selectedCohort] && (
                    <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">

                        {/* Fake Excel Toolbar */}
                        <div className="bg-gray-100 border-b border-gray-300 p-1 flex items-center gap-1">
                            <div className="w-10 h-6 bg-white border border-gray-300 flex items-center justify-center text-xs font-mono text-gray-500 rounded-sm">fx</div>
                            <div className="flex-1 h-6 bg-white border border-gray-300 flex items-center px-2 text-xs font-mono text-gray-700 rounded-sm truncate">
                                =FILTER(APPLICATIONS, COHORT=&#34;{selectedCohort}&#34;)
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse font-sans">
                                <thead className="bg-gray-100 text-gray-600 font-semibold sticky top-0">
                                <tr>
                                    {/* Excel Row Headers */}
                                    <th className="border border-gray-300 px-2 py-1.5 w-10 text-center font-normal bg-gray-200"></th>
                                    <th className="border border-gray-300 px-3 py-1.5 font-normal bg-gray-200 hover:bg-gray-300 cursor-pointer">A <span className="font-semibold text-gray-800 ml-2">Applicant Name</span></th>
                                    <th className="border border-gray-300 px-3 py-1.5 font-normal bg-gray-200 hover:bg-gray-300 cursor-pointer">B <span className="font-semibold text-gray-800 ml-2">Rwandan ID</span></th>
                                    <th className="border border-gray-300 px-3 py-1.5 font-normal bg-gray-200 hover:bg-gray-300 cursor-pointer">C <span className="font-semibold text-gray-800 ml-2">Date Submitted</span></th>
                                    <th className="border border-gray-300 px-3 py-1.5 font-normal bg-gray-200 hover:bg-gray-300 cursor-pointer">D <span className="font-semibold text-gray-800 ml-2">System Status</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                {storageData[selectedYear][selectedCohort].map((app: any, index: number) => (
                                    <tr key={app.id} className="hover:bg-blue-50/30">
                                        {/* Row Number */}
                                        <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-500 bg-gray-100">{index + 1}</td>

                                        <td className="border border-gray-300 px-3 py-1.5 font-medium whitespace-nowrap text-gray-900">
                                            {app.personalInfo?.fullName || "Draft Applicant"}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-1.5 font-mono text-gray-600">
                                            {app.personalInfo?.rwandanId || "N/A"}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-1.5 text-gray-600">
                                            {new Date(app.createdAt).toLocaleString()}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-1.5">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${getStatusStyles(app.status)}`}>
                                                    {app.status.replace(/_/g, ' ')}
                                                </span>
                                            {app.deleted && (
                                                <span className="ml-2 text-red-600 font-bold text-[10px]">(DELETED)</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {/* Empty padding rows to make it look more like Excel */}
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`empty-${i}`}>
                                        <td className="border border-gray-300 px-2 py-3 bg-gray-100"></td>
                                        <td className="border border-gray-300 px-3 py-3"></td>
                                        <td className="border border-gray-300 px-3 py-3"></td>
                                        <td className="border border-gray-300 px-3 py-3"></td>
                                        <td className="border border-gray-300 px-3 py-3"></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}