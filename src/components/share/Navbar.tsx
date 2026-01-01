"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type NavbarProps = {
    className?: string;
};

export const Navbar = ({ className }: NavbarProps) => {
    return (
        <header
            className={cn(
                "flex items-center justify-end py-4 sm:py-6",
                className
            )}
        >
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40">
                <Image
                    src="/images/logo-igire.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </header>
    );
};
