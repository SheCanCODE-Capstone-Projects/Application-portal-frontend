"use client";

import { cn } from "@/lib/utils";

type FooterProps = {
  year?: number;
  className?: string;
};

export const Footer = ({ year, className }: FooterProps) => {
  const displayYear = year ?? new Date().getFullYear();

  return (
    <footer className={cn("mt-auto w-full", className)}>
      <div className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 text-lg sm:text-sm text-emerald-900/80">
        <span className="text-center text-2xl">© {displayYear} Igire Rwanda Organization</span>
      </div>
    </footer>
  );
};

