"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/share/Navbar";
import TrackCard from "./components/TrackCard";
import WelcomeHero from "./components/WelcomeHero";
import FloatingHelp from "./components/FloatingHelp";
import MobileCarousel from "./components/MobileCarousel";
import { Code, Database, Globe } from "lucide-react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(45, 90, 61, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(45, 90, 61, 0.04) 0%, transparent 50%)
              `,
            }}
          />
        </div>
        {children}
      </div>
    </main>
  );
};

const tracks = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Learn to build beautiful, interactive user interfaces with modern web technologies.",
    icon: Code,
    color: "from-emerald-500 to-emerald-600",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    duration: "16 weeks",
  },
  {
    id: "backend",
    title: "Backend Development", 
    description: "Master server-side development, databases, and API creation for robust applications.",
    icon: Database,
    color: "from-amber-500 to-orange-500",
    skills: ["Java", "Node.js", "Express", "MongoDB", "PostgreSQL"],
    duration: "16 weeks",
  },
  {
    id: "fundamentals",
    title: "Web Fundamentals",
    description: "Start your journey with HTML, CSS, and JavaScript fundamentals.",
    icon: Globe,
    color: "from-teal-500 to-emerald-500",
    skills: ["HTML5", "CSS3", "JavaScript", "Git"],
    duration: "16 weeks",
  },
];

export default function OnboardingPage() {
  return (
    <AuroraBackground className="px-4 sm:px-6 lg:px-8">
      <Navbar className="relative z-10" />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-12">
        <WelcomeHero />

        
        <div className="block md:hidden mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <MobileCarousel tracks={tracks} />
          </motion.div>
        </div>

        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto w-full mb-16"
        >
          {tracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.2, duration: 0.6 }}
            >
              <TrackCard track={track} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
        </motion.div>
      </div>
      
      <FloatingHelp />
    </AuroraBackground>
  );
}