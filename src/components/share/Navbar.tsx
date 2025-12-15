"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type NavbarProps = {
  className?: string;
};

export const Navbar = ({ className }: NavbarProps) => {
  return (
    <header className={cn("flex items-center justify-center gap-2 sm:gap-4 py-4 sm:py-6", className)}>
      <div></div>
      <div className="flex items-center">
        <div className="relative h-12 w-12 sm:h-12 sm:w-12 md:h-40 md:w-40 overflow-hidden rounded-full shadow-md shadow-emerald-900/10 ring-1 sm:ring-2 ring-white/60 backdrop-blur">
          <Image
            src="/log.jpeg"
            alt="Logo"
            width={800}
            height={800}
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
};

