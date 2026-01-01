"use client";

import React, { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TrackCard from "./TrackCard";
import { LucideIcon } from "lucide-react";

interface Track {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  skills: string[];
  duration: string;
}

interface MobileCarouselProps {
  tracks: Track[];
}

export default function MobileCarousel({ tracks }: MobileCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      prevSlide();
    } else if (info.offset.x < -threshold) {
      nextSlide();
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-2xl">
        <motion.div
          className="flex"
          animate={{ x: -currentIndex * 100 + "%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          {tracks.map((track, index) => (
            <div key={track.id} className="w-full flex-shrink-0 px-2">
              <TrackCard track={track} />
            </div>
          ))}
        </motion.div>
      </div>

      
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white/90 transition-colors z-10"
        disabled={currentIndex === 0}
      >
        <ChevronLeft size={20} className="text-[#2D5A3D]" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white/90 transition-colors z-10"
        disabled={currentIndex === tracks.length - 1}
      >
        <ChevronRight size={20} className="text-[#2D5A3D]" />
      </button>

      
      <div className="flex justify-center mt-4 space-x-2">
        {tracks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-[#2D5A3D]"
                : "bg-[#2D5A3D]/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}