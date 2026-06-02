"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export default function MonthPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // value format is "YYYY-MM"
  const parsedYear = value ? parseInt(value.split("-")[0], 10) : new Date().getFullYear();
  const parsedMonth = value ? parseInt(value.split("-")[1], 10) - 1 : new Date().getMonth();

  const [viewYear, setViewYear] = useState(parsedYear);

  useEffect(() => {
    if (value) {
      setViewYear(parseInt(value.split("-")[0], 10));
    }
  }, [value]);

  const openDropdown = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 12,
        right: Math.max(window.innerWidth - rect.right, 16),
      });
    }
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const handleMonthClick = (mIndex) => {
    const mm = String(mIndex + 1).padStart(2, "0");
    onChange(`${viewYear}-${mm}`);
    setIsOpen(false);
  };

  const prevYear = () => setViewYear(y => y - 1);
  const nextYear = () => setViewYear(y => y + 1);

  const displayDate = `${MONTHS[parsedMonth]} ${parsedYear}`;

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ position: "fixed", top: dropdownPos.top, right: dropdownPos.right }}
          className="z-[300] w-[320px] bg-white/95 dark:bg-[#111111]/95 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
            <button 
              onClick={prevYear} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors text-lg font-bold hover:bg-primary dark:hover:bg-primary-dark hover:text-white"
            >
              &#10094;
            </button>
            <div className="font-bebas text-3xl tracking-widest text-gray-800 dark:text-white">
              {viewYear}
            </div>
            <button 
              onClick={nextYear} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors text-lg font-bold hover:bg-primary dark:hover:bg-primary-dark hover:text-white"
            >
              &#10095;
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 p-5">
            {MONTHS.map((m, i) => {
              const isSelected = parsedYear === viewYear && parsedMonth === i;
              const isCurrentMonth = new Date().getFullYear() === viewYear && new Date().getMonth() === i;
              
              return (
                <button
                  key={m}
                  onClick={() => handleMonthClick(i)}
                  className={`relative w-full py-4 rounded-2xl font-rajdhani font-bold text-lg transition-all duration-200 flex items-center justify-center
                    ${isSelected ? "bg-primary text-white shadow-lg shadow-primary/30 dark:shadow-primary-dark/50 scale-105 hover:bg-primary hover:text-white" : "text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary-light"}
                    ${isCurrentMonth && !isSelected ? "ring-2 ring-primary/50 text-primary dark:text-primary-light font-extrabold" : ""}
                  `}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <div className="px-5 pb-5">
            <button
              onClick={() => {
                const t = new Date();
                const mm = String(t.getMonth() + 1).padStart(2, "0");
                onChange(`${t.getFullYear()}-${mm}`);
                setViewYear(t.getFullYear());
                setIsOpen(false);
              }}
              className="w-full py-3 rounded-2xl font-rajdhani text-xl font-extrabold tracking-widest text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10 hover:bg-primary/15 dark:hover:bg-primary/20 transition-colors uppercase"
            >
              Bu Ay
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={openDropdown}
        className="flex items-center gap-3 bg-white/70 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white font-rajdhani font-bold transition-all cursor-pointer shadow-glass dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-apple-hover hover:border-gray-300 dark:hover:border-primary-light/50 group select-none text-xl px-6 py-4 rounded-[20px]"
      >
        <svg className="text-primary opacity-80 group-hover:opacity-100 transition-opacity w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span className="tracking-wide">{displayDate}</span>
        <svg className={`text-gray-400 group-hover:text-primary transition-all duration-300 w-5 h-5 shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {mounted && createPortal(dropdownContent, document.body)}
    </div>
  );
}
