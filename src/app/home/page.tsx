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


    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [open]);

  return (
      <AuroraBackground className="px-4 sm:px-6 h-full font-sans">
        <Navbar className="absolute top-12 left-0 right-0 z-10 px-4 sm:px-6" />
          <div className="relative flex min-h-screen w-full mx-auto flex-col pt-20 pb-12 justify-between">
          <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="relative flex flex-1 flex-col items-center justify-center gap-8 sm:gap-8 px-4 sm:px-6 text-center mt-12"
          >
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl sm:text-4xl md:text-6xl lg:text-6xl font-black text-emerald-950 tracking-tight leading-[1.1]"
            >
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b56918] to-amber-600">
              Igire Rwanda
            </span>
            </motion.p>

              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-lg sm:text-xl md:text-2xl text-emerald-900/70 max-w-3xl font-medium leading-relaxed"
              >
                  Empowering the next generation of leaders. Join our cohorts to gain
                  world-class skills, mentorship, and career opportunities.
              </motion.p>

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
                      className="fixed inset-0 z-[999] flex items-center justify-center bg-emerald-950/10 backdrop-blur-sm p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setOpen(false)}
                  >
                      <motion.div
                          className="w-full"
                          initial={{ scale: 0.95, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.95, y: 20 }}
                          transition={{ type: "spring", damping: 25, stiffness: 300 }}
                          onClick={(e) => e.stopPropagation()}
                      >
                          <button
                              onClick={() => setOpen(false)}
                              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors z-50"
                          >
                              <X size={20} />
                          </button>
                          <div className="p-1">
                              <AuthSwitcher />
                          </div>
                      </motion.div>
                  </motion.div>
              )}
          </AnimatePresence>
      </AuroraBackground>
  );
}