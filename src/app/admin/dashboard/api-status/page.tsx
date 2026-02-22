"use client";

import React, { useEffect, useState } from "react";
import * as HoverCardPrimitives from "@radix-ui/react-hover-card";
import {
    RiCheckboxCircleFill,
    RiErrorWarningFill,
    RiSettings5Fill,
} from "@remixicon/react";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { api } from "@/lib/api/api";
import { Loader2 } from "lucide-react";

export function cx(...args: ClassValue[]) {
    return twMerge(clsx(...args));
}

const defaultBackgroundColor = "bg-gray-300 dark:bg-gray-800";

const colorMapping: Record<string, string> = {
    Operational: "bg-emerald-500",
    Downtime: "bg-red-500",
    Maintenance: "bg-amber-500",
    "Not measured": "bg-gray-400",
};

interface DailyStatus {
    date: string;
    tooltip: string;
}

interface ServiceHealth {
    name: string;
    uptime: string;
    data: DailyStatus[];
}

interface BlockProps {
    tooltip: string;
    date: string;
    hoverEffect?: boolean;
}

// Block Component (Individual Day)
const Block = ({ tooltip, date, hoverEffect }: BlockProps) => {
    const [open, setOpen] = React.useState(false);
    const color = colorMapping[tooltip] || defaultBackgroundColor;

    return (
        <HoverCardPrimitives.Root open={open} onOpenChange={setOpen} openDelay={0} closeDelay={0}>
            <HoverCardPrimitives.Trigger onClick={() => setOpen(true)} asChild>
                <div className="h-full w-full overflow-hidden px-[0.5px] transition first:rounded-l-[4px] first:pl-0 last:rounded-r-[4px] last:pr-0 sm:px-px">
                    <div
                        className={cx(
                            "h-full w-full rounded-[1px]",
                            color,
                            hoverEffect ? "hover:opacity-50" : ""
                        )}
                    />
                </div>
            </HoverCardPrimitives.Trigger>
            <HoverCardPrimitives.Portal>
                <HoverCardPrimitives.Content
                    sideOffset={10}
                    side="top"
                    align="center"
                    avoidCollisions
                    className={cx(
                        "min-w-44 max-w-52 rounded-xl shadow-lg dark:shadow-xl z-50",
                        "text-gray-900 dark:text-gray-50",
                        "bg-white dark:bg-gray-900",
                        "border border-gray-200 dark:border-gray-800"
                    )}
                >
                    <p className="flex items-center gap-2 px-3 py-2 text-sm font-medium">
                        {tooltip === "Operational" && <RiCheckboxCircleFill className="size-5 shrink-0 text-emerald-500" aria-hidden={true} />}
                        {tooltip === "Maintenance" && <RiSettings5Fill className="size-5 shrink-0 text-amber-500" aria-hidden={true} />}
                        {tooltip === "Downtime" && <RiErrorWarningFill className="size-5 shrink-0 text-red-500" aria-hidden={true} />}
                        {tooltip}
                    </p>
                    <div className="h-px w-full bg-gray-200 dark:bg-gray-800" aria-hidden={true} />
                    <p className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">{date}</p>
                </HoverCardPrimitives.Content>
            </HoverCardPrimitives.Portal>
        </HoverCardPrimitives.Root>
    );
};

interface TrackerProps extends React.HTMLAttributes<HTMLDivElement> {
    data?: DailyStatus[];
    className?: string;
    hoverEffect?: boolean;
}

// Tracker Component (Row of 90 blocks)
const Tracker = React.forwardRef<HTMLDivElement, TrackerProps>(({ data = [], className, hoverEffect, ...props }, forwardedRef) => {
    return (
        <div ref={forwardedRef} className={cx("flex h-10 items-center", className)} {...props}>
            {data.map((item: DailyStatus, index: number) => (
                <Block key={index} hoverEffect={hoverEffect} {...item} />
            ))}
        </div>
    );
});
Tracker.displayName = "Tracker";

// Main Page
export default function ApiStatusPage() {
    const [healthData, setHealthData] = useState<ServiceHealth[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {
        const fetchHealthData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const res = await api.get("/api/v1/admin/dashboard/system/health", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Expected response: { data: { lastUpdated: "...", services: [...] } }
                setHealthData(res.data.data.services);
                setLastUpdated(res.data.data.lastUpdated);
            } catch (error) {
                console.error("Failed to fetch system health data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHealthData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin w-10 h-10 text-emerald-600" />
                <p className="text-gray-500 font-medium">Analyzing System Health...</p>
            </div>
        );
    }

    // Check if any service has less than 95% uptime
    const isAllOnline = healthData.every(s => parseFloat(s.uptime) > 95.0);

    return (
        <div className="mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
            <div className="flex flex-col items-center">
        <span className={`mx-auto inline-flex items-center justify-center rounded-full p-3 ${isAllOnline ? 'bg-emerald-100 dark:bg-emerald-400/20' : 'bg-red-100 dark:bg-red-400/20'}`}>
          {isAllOnline ? (
              <RiCheckboxCircleFill className="h-10 w-10 text-emerald-500" aria-hidden={true} />
          ) : (
              <RiErrorWarningFill className="h-10 w-10 text-red-500" aria-hidden={true} />
          )}
        </span>
                <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    {isAllOnline ? "All services are online" : "System Degraded"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Last updated on {lastUpdated}
                </p>
            </div>

            <div className="mt-10 space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
                {healthData.map((service, index) => (
                    <React.Fragment key={service.name}>
                        <div>
                            <p className="flex justify-between text-sm font-medium">
                <span className="flex items-center gap-2">
                  <RiCheckboxCircleFill className="size-5 text-emerald-500" aria-hidden={true} />
                  <span className="text-gray-900 dark:text-gray-50">{service.name}</span>
                </span>
                                <span className="text-gray-900 dark:text-gray-50">{service.uptime}% uptime</span>
                            </p>

                            <Tracker hoverEffect data={service.data} className="mt-4 hidden w-full lg:flex" />
                            <Tracker hoverEffect data={service.data.slice(30, 90)} className="mt-4 hidden w-full sm:flex lg:hidden" />
                            <Tracker hoverEffect data={service.data.slice(60, 90)} className="mt-4 flex w-full sm:hidden" />

                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span className="hidden lg:block">90 days ago</span>
                                <span className="hidden sm:block lg:hidden">60 days ago</span>
                                <span className="sm:hidden">30 days ago</span>
                                <span>Today</span>
                            </div>
                        </div>

                        {index < healthData.length - 1 && (
                            <div className="h-px w-full bg-gray-200 dark:bg-gray-800" aria-hidden={true} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}