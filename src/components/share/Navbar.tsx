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
                "flex items-center justify-center gap-2 sm:gap-4 py-4 sm:py-6",
                className
            )}
        >
            <div className="flex items-center">
                <div className="relative h-12 w-12 sm:h-12 sm:w-12 md:h-40 md:w-40">
                    <Image
                        src="/images/logo-igire.png"
                        alt="Logo"
                        width={800}
                        height={800}
                        className="object-contain bg-transparent"
                        priority
                    />
                </div>
            </div>
        </header>
    );
};
