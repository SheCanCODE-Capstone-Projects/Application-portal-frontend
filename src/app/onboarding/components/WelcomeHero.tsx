"use client";

import React from "react";
import { motion } from "framer-motion";



export default function WelcomeHero() {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-amber-100 text-[#2D5A3D] px-4 py-2 rounded-full text-sm font-medium mb-6"
        >
          <h1  className="text-amber-500" />
          Igire Rwanda
        </motion.div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-[#2D5A3D]">Choose Your </span>
          <span className="bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
            Path
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-[#2D5A3D]/70 mb-4 max-w-3xl mx-auto">
          Select the learning track you want to pursue. Each path will guide you with everything you need to become an expert.
        </p>
      </motion.div>
    </div>
  );
}