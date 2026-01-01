"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail, MapPin } from "lucide-react";

export default function FloatingHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-3 md:mb-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20 w-72 md:w-80 max-w-[calc(100vw-2rem)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#2D5A3D]">Need Help?</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#2D5A3D]/60 hover:text-[#2D5A3D] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-[#2D5A3D]/70 text-sm mb-4">
              Contact us to help you choose the right path
            </p>
            
            <div className="space-y-2 md:space-y-3">
              <motion.a
                whileHover={{ x: 4 }}
                href="tel:+250788123456"
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <Phone size={14} className="text-emerald-600 md:w-4 md:h-4" />
                <div>
                  <div className="text-xs md:text-sm font-medium text-[#2D5A3D]">Call Us</div>
                  <div className="text-xs text-[#2D5A3D]/60">+250 788 123 456</div>
                </div>
              </motion.a>
              
              <motion.a
                whileHover={{ x: 4 }}
                href="mailto:info@igirerwanda.org"
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <Mail size={14} className="text-amber-600 md:w-4 md:h-4" />
                <div>
                  <div className="text-xs md:text-sm font-medium text-[#2D5A3D]">Send Email</div>
                  <div className="text-xs text-[#2D5A3D]/60">info@igirerwanda.org</div>
                </div>
              </motion.a>
              
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-teal-50"
              >
                <MapPin size={14} className="text-teal-600 md:w-4 md:h-4" />
                <div>
                  <div className="text-xs md:text-sm font-medium text-[#2D5A3D]">Visit Us</div>
                  <div className="text-xs text-[#2D5A3D]/60">Kigali, Rwanda</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-emerald-500 to-amber-500 text-white p-3 md:p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
      >
        <MessageCircle size={20} className="md:w-6 md:h-6" />
      </motion.button>
    </div>
  );
}