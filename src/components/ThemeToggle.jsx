"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle({ className, isInline = false }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className={isInline ? "w-12 h-12 md:w-14 md:h-14 shrink-0" : "fixed top-8 right-8 z-[110] w-14 h-14"} />; // Avoid layout shift

  const isDark = theme === "dark";
  
  const baseClasses = isInline
    ? `w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm transition-all duration-500 overflow-hidden group shrink-0 hover:shadow-apple-hover dark:hover:border-primary-light/30 ${className || ''}`
    : `fixed top-6 right-6 md:top-8 md:right-8 z-[110] w-14 h-14 rounded-full flex items-center justify-center bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(139,92,246,0.15)] backdrop-blur-xl transition-all duration-500 overflow-hidden group ${className || ''}`;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={baseClasses}
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ y: -30, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 30, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-6 h-6 text-primary-light group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: -30, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 30, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-6 h-6 text-gray-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
