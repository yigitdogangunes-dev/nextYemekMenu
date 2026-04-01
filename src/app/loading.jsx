"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      
      {/* Background Orbs (Subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        
        {/* Pulsing Logo Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ 
            scale: [0.9, 1.05, 0.9],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative w-32 h-32 md:w-40 md:h-40"
        >
          <Image 
            src="/assets/svgexport-1.svg" 
            alt="Kodpilot Logo" 
            fill 
            className="object-contain dark:invert drop-shadow-2xl" 
            priority 
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="flex flex-col items-center gap-2"
        >
          <h2 className="font-bebas text-4xl md:text-5xl tracking-[0.2em] text-foreground/80 lowercase">
            yükleniyor<span className="text-primary animate-pulse">...</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-50" />
        </motion.div>

      </div>

      {/* Decorative Strip at bottom for premium feel */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-primary-dark opacity-30" />
    </div>
  );
}