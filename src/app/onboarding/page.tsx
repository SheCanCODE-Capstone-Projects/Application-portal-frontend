"use client";

import React, { ReactNode, useState } from "react";
import {AnimatePresence, motion} from "framer-motion";
import { cn } from "@/lib/utils";
import programs from "@/data/programe";
import Image from "next/image";
import {X} from "lucide-react";

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
                "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
                className
            )}
            {...props}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
                className={cn(
                    `
            [--white-gradient:repeating-linear-gradient(100deg,#f0f5f0_0%,#f0f5f0_7%,transparent_10%,transparent_12%,#f0f5f0_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,#1a2e1a_0%,#1a2e1a_7%,transparent_10%,transparent_12%,#1a2e1a_16%)]
            [--aurora:repeating-linear-gradient(100deg,#3d5c3d_10%,#c97a1a_15%,#5a7d5a_20%,#d4a84a_25%,#4a6b4a_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
                    showRadialGradient &&
                    `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
                )}
            ></div>
          </div>
          {children}
        </div>
      </main>
  );
};



export default function OnboardingPage() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const activeProgram = programs.find(p => p.id === selectedProgram);

  return (
      <AuroraBackground className="px-4">
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center"
        >
          {/* HEADER */}
          <p className="text-2xl font-bold text-green-700 mb-2">
            Onboarding To a Cohort
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-3">
            What kind of cohort would you like to join?
          </h1>

          <p className="text-slate-800 text-center max-w-xl mb-10">
            Choose the program that best fits your goals and start learning with a focused cohort.
          </p>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full place-items-center">
            {programs.map((program, index) => {
              const isActive = selectedProgram === program.id;

              return (
                  <motion.button
                      key={program.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                      onClick={() => setSelectedProgram(program.id)}
                      className={cn(
                          "group relative h-80 w-full",
                          "rounded-2xl overflow-hidden border transition-all duration-300",
                          "cursor-pointer hover:shadow-lg",
                          isActive
                              ? "border-orange-400"
                              : "border-slate-200"
                      )}
                  >

                    <Image
                        src={program.image}
                        alt={program.title}
                        width="600"
                        height="600"
                        className="absolute inset-0 w-full h-full object-cover"
                    />


                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/65 transition-all" />


                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <h3 className="text-white text-lg font-bold text-center">
                        {program.title}
                      </h3>
                    </div>
                  </motion.button>
              );
            })}

              <AnimatePresence>
                  {activeProgram && (
                      <motion.div
                          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                      >
                          <motion.div
                              className="relative w-full max-w-3xl bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 overflow-y-auto max-h-[80vh]"
                              initial={{ scale: 0.95, y: 20 }}
                              animate={{ scale: 1, y: 0 }}
                              exit={{ scale: 0.95, y: 20 }}
                              transition={{ duration: 0.2, type: "spring", stiffness: 600, damping: 32 }}
                          >

                              <button
                                  className="absolute top-6 right-5 text-gray-700 hover:text-gray-900 rounded-full border border-gray-300 shadow"
                                  onClick={() => setSelectedProgram(null)}
                              >
                                  <X size={20} />
                              </button>

                              {/* ICON */}
                              <div className="flex items-center space-x-4 mb-4">
                                  {activeProgram.icon && (
                                      <activeProgram.icon className={`w-8 h-8 text-orange-500`} />
                                  )}
                                  <h2 className="text-2xl font-bold">{activeProgram.title}</h2>
                              </div>

                              {/* DESCRIPTION */}
                              <p className="text-gray-800 dark:text-gray-200 mb-4">
                                  {activeProgram.description}
                              </p>

                              {/* LANGUAGES */}
                              {activeProgram.languages && activeProgram.languages.length > 0 && (
                                  <div className="mb-4">
                                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                          Languages & Tools:
                                      </h3>
                                      <div className="flex flex-wrap gap-3">
                                          {activeProgram.languages.map((lang, idx) => {
                                              const Icon = lang.icon;
                                              return (
                                                  <div
                                                      key={idx}
                                                      className="flex items-center gap-1 px-2 py-1"
                                                  >
                                                      <Icon className="w-5 h-5 text-green-600" />
                                                      <span className="text-gray-700 dark:text-gray-300 text-sm">{lang.name}</span>
                                                  </div>
                                              );
                                          })}
                                      </div>
                                  </div>
                              )}

                              {/* DURATION & SCHEDULE */}
                              <div className="flex flex-col mb-6">
                                  <div className="flex items-center space-x-4">
                                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Duration:</h3>
                                      <p className="text-gray-700 dark:text-gray-300">{activeProgram.duration}</p>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Schedule:</h3>
                                      <p className="text-gray-700 dark:text-gray-300">{activeProgram.schedule}</p>
                                  </div>
                              </div>

                              {/* CONTINUE BUTTON */}
                              <button
                                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-full"
                                  onClick={() => {
                                      // Add your "continue" logic here, e.g., go to next step
                                      console.log("Continue clicked for", activeProgram.title);
                                  }}
                              >
                                  Continue
                              </button>
                          </motion.div>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
        </motion.div>
      </AuroraBackground>
  );
}