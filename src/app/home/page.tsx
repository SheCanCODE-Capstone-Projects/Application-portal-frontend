"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Footer } from "@/components/share/Footer";
import { Navbar } from "@/components/share/Navbar";
import { X } from "lucide-react";
import AuthSwitcher from "@/app/(auth)/AuthSwitcher/AuthSwitcher";
import {AuroraBackground} from "@/components/background/page";
import { ApplyNowButton } from "@/components/share/ApplyNowButton";
export default function LandingPage() {
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
      <AuroraBackground className="px-3 sm:px-4">
        <Navbar className="absolute top-12 left-0 right-0 z-10 px-4 sm:px-6" />
        <div className="relative flex h-full w-full max-w-6xl mx-auto flex-col mt-24">
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
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            >
                <ApplyNowButton 
                    className="mt-6 rounded-full bg-[#2f573d] px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-semibold text-white shadow-lg hover:scale-105 transition-all duration-200 min-w-[160px] disabled:opacity-70"
                    onNeedAuth={() => setOpen(true)}
                />
            </motion.div>
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


                  <AuthSwitcher />
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </AuroraBackground>
  );
}