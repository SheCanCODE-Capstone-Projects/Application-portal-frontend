"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type NavbarProps = {
  className?: string;
};

export const Navbar = ({ className }: NavbarProps) => {
  return (
    <header className={cn("flex items-center justify-between gap-2 sm:gap-4 py-4 sm:py-6", className)}>
      <div></div>
      <div className="flex items-center">
        <div className="relative h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 overflow-hidden rounded-full bg-white/80 shadow-lg shadow-emerald-900/10 ring-2 sm:ring-3 ring-white/60 backdrop-blur">
          <Image
            src="/log.jpeg"
            alt="Logo"
            fill
            sizes="(max-width: 640px) 64px, (max-width: 768px) 72px, 80px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
};

