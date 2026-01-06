"use client";

import React, { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Code, Database, Globe, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
}

const AuroraBackground = ({
  className,
  children,
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

const programs = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Learn to build beautiful, interactive user interfaces with modern web technologies.",
    icon: Code,
    image: "/images/frontend.jpg",
    color: "from-emerald-500 to-emerald-600",
    languages: ["React", "TypeScript", "Tailwind CSS", "Next.js", "HTML5", "CSS3"],
    duration: "16 weeks",
    schedule: "Monday - Friday, 8:20 AM - 4:30 PM",
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Master server-side development, databases, and API creation for robust applications.",
    icon: Database,
    image: "/images/backend.jpg",
    color: "from-amber-500 to-orange-500",
    languages: ["Java", "Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"],
    duration: "16 weeks",
    schedule: "Monday - Friday, 8:20 AM - 4:30 PM",
  },
  {
    id: "fundamentals",
    title: "Web Fundamentals",
    description: "Start your journey with HTML, CSS, and JavaScript fundamentals.",
    icon: Globe,
    image: "/images/webfundamental.jpg",
    color: "from-teal-500 to-emerald-500",
    languages: ["HTML5", "CSS3", "JavaScript", "Git", "Responsive Design"],
    duration: "12 weeks",
    schedule: "Monday - Friday, 8:20 AM - 4:30 PM",
  },
];

export default function OnboardingPage() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const handleSelectProgram = (programId: string) => {
    setSelectedProgram(programId);
  };

  const handleBackToSelection = () => {
    setSelectedProgram(null);
  };

  if (selectedProgram) {
    const program = programs.find(p => p.id === selectedProgram);
    if (!program) return null;

    const Icon = program.icon;

    return (
      <AuroraBackground className="px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-12 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto px-4"
          >
            <div className={`w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-2xl bg-gradient-to-r ${program.color} flex items-center justify-center mx-auto mb-4 md:mb-6`}>
              <Icon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-[#2D5A3D] mb-2 md:mb-4">
              {program.title}
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-[#2D5A3D]/70 mb-6 md:mb-8">
              {program.description}
            </p>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/20 mb-6 md:mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2D5A3D] mb-4 md:mb-6">What You'll Learn</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
                {program.languages.map((lang, i) => (
                  <div key={i} className="bg-emerald-50 text-[#2D5A3D] px-2 sm:px-3 md:px-4 py-1 md:py-2 rounded-lg text-center font-medium text-xs sm:text-sm md:text-base">
                    {lang}
                  </div>
                ))}
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6 text-left">
                <div>
                  <h4 className="font-bold text-[#2D5A3D] mb-2 text-sm md:text-base">Duration</h4>
                  <p className="text-[#2D5A3D]/70 text-sm md:text-base">{program.duration}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#2D5A3D] mb-2 text-sm md:text-base">Schedule</h4>
                  <p className="text-[#2D5A3D]/70 text-sm md:text-base">{program.schedule}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button
                onClick={handleBackToSelection}
                className="bg-white/90 backdrop-blur-sm text-[#2D5A3D] px-6 md:px-8 py-2 md:py-3 rounded-full shadow-lg hover:bg-white transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <ArrowLeft size={16} className="md:w-5 md:h-5" />
                Back to Programs
              </button>
              
              <button
                className="bg-gradient-to-r from-emerald-500 to-amber-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground className="px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-[#2D5A3D] mb-2 md:mb-4">
            Choose Your Path
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#2D5A3D]/70 mb-8 md:mb-12">
            Select a program to start your journey in web development
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {programs.map((program, index) => {
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all overflow-hidden flex flex-col h-64 sm:h-72 md:h-80"
                >
                  <div className="flex-1 overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-[#2D5A3D] mb-3 md:mb-4 text-center">{program.title}</h3>
                    <button
                      onClick={() => handleSelectProgram(program.id)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-amber-500 text-white py-2 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-medium text-sm md:text-base"
                    >
                      Select
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}