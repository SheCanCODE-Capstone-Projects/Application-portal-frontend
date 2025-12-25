"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/share/Footer";
import { Navbar } from "@/components/share/Navbar";
import LoginForm from "@/components/auth/LoginForm";
import { X } from "lucide-react";

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

export default function Home() {
  const year = new Date().getFullYear();
  const [open, setOpen] = useState(false);

  /* Lock background scroll when modal opens */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
      <AuroraBackground className="px-2 sm:px-4">
        {/* NAVBAR */}
        <Navbar className="absolute top-0 left-2 right-0 z-10 px-3 sm:px-6" />

        {/* MAIN CONTENT */}
        <div className="relative z-20 flex h-full w-full max-w-7xl mx-auto flex-col mt-12">
          <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
          >
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-semibold text-emerald-900"
            >
              Welcome to{" "}
              <span className="font-extrabold text-[#b56918]">
              Igire Rwanda
            </span>
            </motion.p>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg sm:text-xl text-emerald-900/80"
            >
              Application Portal & Track your progress
            </motion.p>

            {/* APPLY BUTTON */}
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-6 rounded-full bg-[#2f573d] px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-semibold text-white shadow-lg hover:scale-105 transition-all duration-200 min-w-[160px]"
                onClick={() => setOpen(true)}
            >
              Apply Now
            </motion.button>
          </motion.div>

          <Footer year={year} />
        </div>

        <AnimatePresence>
          {open && (
              <motion.div
                  className="fixed inset-0 z-[999] flex items-center justify-center bg-black/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
              >
                  <motion.div
                      className="relative w-full bg-zinc-50/30 backdrop-blur-xl p-6"
                      initial={{ scale: 0.96, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.96, y: 20 }}
                      transition={{
                          duration: 0.1,
                          ease: "linear",
                          type: "spring",
                          stiffness: 600,
                          damping: 32,
                      }}
                      onClick={(e) => e.stopPropagation()}
                  >

                  {/* Close button */}
                  <button
                      onClick={() => setOpen(false)}
                      className="absolute right-14 top-10 text-gray-700 hover:text-black rounded-full shadow-md bg-white p-2"
                  >
                    <X size={24} />
                  </button>


                  <LoginForm />
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </AuroraBackground>
  );
}
