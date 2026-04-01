"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function DatePicker({ value, onChange, min, max, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const parsedValue = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState(parsedValue.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedValue.getMonth());

  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
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
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedDay = parsedValue.getDate();
  const selectedMonth = parsedValue.getMonth();
  const selectedYear = parsedValue.getFullYear();

  let firstDay = new Date(viewYear, viewMonth, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const today = new Date();
  today.setHours(0,0,0,0);

  const minDate = min ? new Date(min + "T00:00:00") : null;
  const maxDate = max ? new Date(max + "T00:00:00") : null;

  const handleDayClick = (day) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isDayDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  const isDayToday = (day) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isDaySelected = (day) => day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;

  const displayDate = `${String(selectedDay).padStart(2,"0")} ${MONTHS[selectedMonth]} ${selectedYear}`;
  const displayDateShort = `${String(selectedDay).padStart(2,"0")} ${MONTHS[selectedMonth].substring(0,3)}`;

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
          className="z-[300] w-[360px] md:w-[400px] bg-white/95 dark:bg-[#111111]/95 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
            <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-primary dark:hover:bg-primary-dark hover:text-white transition-colors text-lg font-bold">
              &#10094;
            </button>
            <div className="font-bebas text-3xl tracking-widest text-gray-800 dark:text-white">
              {MONTHS[viewMonth]} {viewYear}
            </div>
            <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-primary dark:hover:bg-primary-dark hover:text-white transition-colors text-lg font-bold">
              &#10095;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 px-4 pt-4 pb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center font-rajdhani font-bold text-gray-400 dark:text-gray-500 text-sm uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 px-4 pb-5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const disabled = isDayDisabled(day);
              const selected = isDaySelected(day);
              const isTodays = isDayToday(day);
              return (
                <button
                  key={day}
                  disabled={disabled}
                  onClick={() => handleDayClick(day)}
                  className={`relative w-full aspect-square rounded-2xl font-rajdhani font-bold text-lg transition-all duration-200 flex items-center justify-center
                    ${disabled ? "text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary-light"}
                    ${selected ? "bg-primary text-white shadow-lg shadow-primary/30 dark:shadow-primary-dark/50 scale-105 hover:bg-primary hover:text-white dark:hover:text-white dark:hover:bg-primary" : ""}
                    ${isTodays && !selected ? "ring-2 ring-primary/50 text-primary dark:text-primary-light font-extrabold" : ""}
                    ${!selected && !isTodays && !disabled ? "text-gray-700 dark:text-gray-300" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={() => {
                const t = new Date();
                const mm = String(t.getMonth() + 1).padStart(2, "0");
                const dd = String(t.getDate()).padStart(2, "0");
                onChange(`${t.getFullYear()}-${mm}-${dd}`);
                setViewYear(t.getFullYear());
                setViewMonth(t.getMonth());
                setIsOpen(false);
              }}
              className="w-full py-3 rounded-2xl font-rajdhani text-xl font-extrabold tracking-widest text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10 hover:bg-primary/15 dark:hover:bg-primary/20 transition-colors uppercase"
            >
              Bugün
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
        className={`flex items-center gap-2 md:gap-4 bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 text-foreground font-rajdhani font-bold transition-all cursor-pointer shadow-glass dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-apple-hover hover:border-gray-300 dark:hover:bg-black/80 dark:hover:border-primary-light/50 group select-none ${
          compact 
            ? "text-xl md:text-2xl px-4 md:px-6 py-2 md:py-3 rounded-[16px]" 
            : "text-3xl lg:text-4xl px-8 py-4 rounded-[24px]"
        }`}
      >
        <svg className={`text-primary opacity-70 group-hover:opacity-100 transition-opacity shrink-0 ${compact ? "w-5 h-5" : "w-7 h-7"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>{compact ? <><span className="md:hidden">{displayDateShort}</span><span className="hidden md:inline">{displayDate}</span></> : displayDate}</span>
        <svg className={`text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""} ${compact ? "w-4 h-4" : "w-5 h-5"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {mounted && createPortal(dropdownContent, document.body)}
    </div>
  );
}
