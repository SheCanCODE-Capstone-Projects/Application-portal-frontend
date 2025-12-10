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
        <div className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 overflow-hidden rounded-full bg-white/80 shadow-md shadow-emerald-900/10 ring-1 sm:ring-2 ring-white/60 backdrop-blur">
          <Image
            src="/log.jpeg"
            alt="Logo"
            fill
            sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
};

