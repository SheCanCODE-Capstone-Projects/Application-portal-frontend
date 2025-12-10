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
      <div className="flex items-center justify-center rounded-t-xl sm:rounded-t-2xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-emerald-900/80 shadow-lg shadow-emerald-900/10 backdrop-blur-sm">
        <span className="text-center">© {displayYear} Igire Rwanda Organization</span>
      </div>
    </footer>
  );
};

