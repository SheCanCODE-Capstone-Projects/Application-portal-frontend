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
      <div className="flex items-center justify-center rounded-t-2xl  px-4 py-3 text-sm text-emerald-900/80 shadow-lg shadow-emerald-900/10 backdrop-blur-sm sm:px-6">
        <span>© {displayYear} Igire Rwanda Organization</span>
      </div>
    </footer>
  );
};

