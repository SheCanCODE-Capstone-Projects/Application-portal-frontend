"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/share/Footer";
import { Navbar } from "@/components/share/Navbar";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const navigate = () => {
    router.push('/');
  }


  return (
    <AuroraBackground className="px-3 sm:px-4">
      <Navbar className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-6" />
      <div className="relative flex h-full w-full max-w-6xl mx-auto flex-col">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-1 flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="space-y-2 sm:space-y-4"
          >
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-emerald-900">
              Welcome to
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-[#b56918]">
              Igire Rwanda
            </h1>
          </motion.div>
          {/*<motion.h1*/}
          {/*  initial={{ opacity: 0, y: 20 }}*/}
          {/*  whileInView={{ opacity: 1, y: 0 }}*/}
          {/*  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}*/}
          {/*  className="text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight text-[#b56918] drop-shadow"*/}
          {/*>*/}
          {/*  Igire Rwanda*/}
          {/*</motion.h1>*/}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-emerald-900/80 max-w-2xl"
          >
            Application Portal & Track your progress
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            className="mt-6 rounded-full bg-[#2f573d] px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-semibold text-white shadow-lg hover:scale-105 transition-all duration-200 min-w-[160px]"
            onClick={navigate}
          >
            Apply Now
          </motion.button>
        </motion.div>

        <Footer year={year} />
      </div>
    </AuroraBackground>
  );
}