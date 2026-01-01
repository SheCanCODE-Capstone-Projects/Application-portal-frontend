"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight, Clock, CheckCircle } from "lucide-react";

interface Track {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  skills: string[];
  duration: string;
}

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  const IconComponent = track.icon;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 cursor-pointer overflow-hidden"
    >
      
      <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
      
      
      <motion.div
        whileHover={{ rotate: 5, scale: 1.1 }}
        className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${track.color} text-white mb-6 shadow-lg`}
      >
        <IconComponent size={28} />
      </motion.div>

      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-[#2D5A3D] mb-2 group-hover:text-[#1F4A2D] transition-colors">
          {track.title}
        </h3>
        
        <p className="text-[#2D5A3D]/60 text-sm leading-relaxed mb-6">
          {track.description}
        </p>

        
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-amber-500" />
          <span className="text-sm font-medium text-[#2D5A3D]/70">
            {track.duration}
          </span>
        </div>

        
        <div className="space-y-2 mb-6">
          <p className="text-xs font-semibold text-[#2D5A3D]/50 uppercase tracking-wide">
            You will Learn:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {track.skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                <span className="text-xs text-[#2D5A3D]/60 font-medium">
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${track.color} text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
        >
          <span>Choose This Path</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-amber-200/20 to-transparent rounded-full blur-lg" />
    </motion.div>
  );
}