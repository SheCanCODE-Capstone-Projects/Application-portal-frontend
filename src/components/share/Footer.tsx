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
      <div className="flex items-center justify-center px-4 py-3 sm:px-6 sm:py-4">
        <span className="text-center text-xs sm:text-sm md:text-base text-emerald-900/70 font-medium">
          © {displayYear} Igire Rwanda Organization
        </span>
      </div>
    </footer>
  );
};

