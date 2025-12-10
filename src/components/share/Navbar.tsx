"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type NavbarProps = {
  className?: string;
};

export const Navbar = ({ className }: NavbarProps) => {
  return (
    <header className={cn("flex items-center justify-between gap-4 py-6", className)}>
      <div></div>
      <div className="flex items-center">
        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white/80 shadow-md shadow-emerald-900/10 ring-2 ring-white/60 backdrop-blur">
          <Image
            src="/log.jpeg"
            alt="Logo"
            fill
            sizes="56px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
};

