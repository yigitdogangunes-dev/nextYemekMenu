"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden px-4">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-primary-light/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Animated 404 Text */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="font-fugaz text-[120px] md:text-[180px] leading-none bg-gradient-to-b from-primary-light via-primary to-primary-dark bg-clip-text text-transparent drop-shadow-2xl opacity-80"
        >
          404
        </motion.h1>

        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="font-bebas text-4xl md:text-5xl text-foreground tracking-widest uppercase mb-4">
            Aradığınız Lezzet Bulunamadı
          </h2>
          <p className="font-rajdhani text-xl md:text-2xl text-gray-400 dark:text-gray-500 max-w-md mx-auto mb-10 font-medium">
            Görünüşe göre rotadan saptık. Endişelenmeyin, mutfak hala açık!
          </p>
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.4 }}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
        >
          <Link href="/" className="group relative flex items-center gap-3 bg-white/70 dark:bg-[#111111]/80 backdrop-blur-xl px-10 py-5 rounded-[24px] border border-gray-200 dark:border-white/10 shadow-apple hover:shadow-apple-hover transition-all overflow-hidden duration-500">
            <div className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-primary-light to-primary-dark transition-all duration-500 ease-out group-hover:w-full z-0" />
            <span className="relative z-10 font-bebas text-2xl md:text-3xl tracking-widest text-gray-800 dark:text-gray-200 group-hover:text-white transition-colors duration-300">
              Ana Menüye Dön
            </span>
            <svg 
              className="relative z-10 w-6 h-6 text-primary group-hover:text-white transition-all transform group-hover:translate-x-1" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

      </div>

      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-primary-dark opacity-30" />
    </div>
  );
}