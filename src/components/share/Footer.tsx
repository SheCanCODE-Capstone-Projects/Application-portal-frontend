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
      <div className="flex items-center justify-center px-4 py-3 sm:px-6 sm:py-4 text-sm text-emerald-900/70">
        <span className="text-center">© {displayYear} Igire Rwanda Organization</span>
      </div>
    </footer>
  );
};

