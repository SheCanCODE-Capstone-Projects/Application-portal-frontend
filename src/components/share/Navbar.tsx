"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type NavbarProps = {
  className?: string;
};

export const Navbar = ({ className }: NavbarProps) => {
  return (
    <header className={cn("flex items-center justify-end py-3 sm:py-4 md:py-6", className)}>
      <div className="flex items-center">
        <div className="relative h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 overflow-hidden rounded-full bg-white/90 shadow-lg ring-2 ring-white/70 backdrop-blur-sm">
          <Image
            src="/log.jpeg"
            alt="Logo"
            fill
            sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
};
