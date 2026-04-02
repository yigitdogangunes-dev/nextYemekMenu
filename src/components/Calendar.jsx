"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export default function Calendar({ currentDate, setCurrentDate, records, onDayClick, min, max }) {
  const minDate = min ? new Date(min + "T00:00:00") : null;
  const maxDate = max ? new Date(max + "T00:00:00") : null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const [pickerMode, setPickerMode] = useState(null); // null | "month" | "year"

  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1; 

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const isPrevDisabled = minDate && (year < minDate.getFullYear() || (year === minDate.getFullYear() && month <= minDate.getMonth()));
  const isNextDisabled = maxDate && (year > maxDate.getFullYear() || (year === maxDate.getFullYear() && month >= maxDate.getMonth()));

  const handlePrevMonth = () => {
    if (isPrevDisabled) return;
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    if (isNextDisabled) return;
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleMonthSelect = (m) => {
    setCurrentDate(new Date(year, m, 1));
    setPickerMode(null);
  };

  const handleYearSelect = (y) => {
    setCurrentDate(new Date(y, month, 1));
    setPickerMode(null);
  };

  const emptyBoxes = Array.from({ length: firstDay });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const currentYear = new Date().getFullYear();
  const startYear = minDate ? minDate.getFullYear() : currentYear - 5;
  const yearRange = Array.from({ length: 12 }, (_, i) => startYear + i);

  return (
    <div className="bg-white/70 dark:bg-[#111111]/80 backdrop-blur-3xl border border-white dark:border-white/10 shadow-apple dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[40px] p-6 lg:p-10 transition-colors duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-white/10 relative">
        <button 
          onClick={handlePrevMonth}
          disabled={isPrevDisabled}
          className={`w-12 h-12 flex items-center justify-center rounded-[18px] bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors border border-gray-200 dark:border-transparent text-xl font-bold shadow-sm
            ${isPrevDisabled ? 'opacity-10 cursor-not-allowed grayscale' : 'hover:bg-primary dark:hover:bg-primary-dark hover:text-white dark:hover:text-white'}
          `}
        >
          &#10094;
        </button> 
        
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={() => setPickerMode(pickerMode === "month" ? null : "month")}
            className={`font-bebas text-5xl tracking-widest cursor-pointer transition-all duration-300 hover:text-primary dark:hover:text-primary-light px-3 py-1 rounded-2xl hover:bg-primary/5 dark:hover:bg-primary/10 ${pickerMode === "month" ? "text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10" : "bg-gradient-to-r from-gray-700 to-gray-400 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"}`}
          >
            {MONTHS[month]}
          </button>
          <button
            onClick={() => setPickerMode(pickerMode === "year" ? null : "year")}
            className={`font-bebas text-5xl tracking-widest cursor-pointer transition-all duration-300 hover:text-primary dark:hover:text-primary-light px-3 py-1 rounded-2xl hover:bg-primary/5 dark:hover:bg-primary/10 ${pickerMode === "year" ? "text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10" : "bg-gradient-to-r from-gray-700 to-gray-400 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"}`}
          >
            {year}
          </button>
        </div>

        <button 
          onClick={handleNextMonth}
          disabled={isNextDisabled}
          className={`w-12 h-12 flex items-center justify-center rounded-[18px] bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors border border-gray-200 dark:border-transparent text-xl font-bold shadow-sm
            ${isNextDisabled ? 'opacity-10 cursor-not-allowed grayscale' : 'hover:bg-primary dark:hover:bg-primary-dark hover:text-white dark:hover:text-white'}
          `}
        >
          &#10095;
        </button> 
      </div>

      {/* MONTH / YEAR PICKER DROPDOWNS */}
      <AnimatePresence mode="wait">
        {pickerMode === "month" && (
          <motion.div
            key="month-picker"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden mb-8"
          >
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-gray-50/80 dark:bg-[#0a0a0a]/60 rounded-[24px] border border-gray-100 dark:border-white/5">
              {MONTHS.map((m, idx) => (
                <button
                  key={m}
                  onClick={() => handleMonthSelect(idx)}
                  className={`py-4 px-2 rounded-2xl font-rajdhani text-xl md:text-2xl font-extrabold tracking-wider transition-all duration-300 ${
                    idx === month 
                      ? "bg-primary text-white shadow-lg shadow-primary/30 dark:shadow-primary-dark/40 scale-105" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary-light"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {pickerMode === "year" && (
          <motion.div
            key="year-picker"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden mb-8"
          >
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 p-4 bg-gray-50/80 dark:bg-[#0a0a0a]/60 rounded-[24px] border border-gray-100 dark:border-white/5">
              {yearRange.map((y) => (
                <button
                  key={y}
                  onClick={() => handleYearSelect(y)}
                  className={`py-4 px-2 rounded-2xl font-rajdhani text-xl md:text-2xl font-extrabold tracking-wider transition-all duration-300 ${
                    y === year 
                      ? "bg-primary text-white shadow-lg shadow-primary/30 dark:shadow-primary-dark/40 scale-105" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary-light"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DAYS LEGEND */}
      <div className="grid grid-cols-7 gap-2 lg:gap-4 mb-4">
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map(d => (
          <div key={d} className="text-center font-rajdhani font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-lg md:text-xl">
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR SQUARES GRID */}
      <div className="grid grid-cols-7 gap-2 lg:gap-4">
        {emptyBoxes.map((_, index) => (
          <div key={`empty-${index}`} className="opacity-0"></div>
        ))}

        {days.map((day) => {
          const formattedMonth = String(month + 1).padStart(2, '0');
          const formattedDay = String(day).padStart(2, '0');
          const fullDate = `${year}-${formattedMonth}-${formattedDay}`;

          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const midnightToday = new Date();
          midnightToday.setHours(0, 0, 0, 0);
          const cellDate = new Date(year, month, day);
          const isFuture = cellDate > midnightToday;

          const dayRecords = records[fullDate] || [];
          const orderProfiles = [...new Set(dayRecords.map(record => record.profil))];
          const hasOrders = orderProfiles.length > 0;

          return (
            <motion.div 
              key={day} 
              onClick={() => !isFuture && onDayClick(fullDate, dayRecords)}
              whileHover={!isFuture ? { y: -5, scale: 1.02 } : {}}
              className={`group relative h-[120px] md:h-[150px] rounded-2xl p-2 md:p-3 border transition-all duration-300 flex flex-col items-start justify-start overflow-hidden
                ${isFuture ? 'opacity-30 pointer-events-none grayscale bg-gray-50 dark:bg-black/20 border-gray-100 dark:border-white/5' : 'cursor-pointer'}
                ${isToday && !hasOrders ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : ''}
                ${!isFuture && !isToday && !hasOrders ? 'bg-white dark:bg-[#151515] border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-apple' : ''}
                ${hasOrders ? 'bg-white dark:bg-[#151515] border-primary/40 dark:border-primary-dark/50 hover:border-primary hover:shadow-apple dark:hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]' : ''}
              `}
            >
              {hasOrders && (
                <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 z-0"></div>
              )}

              <span className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full font-rajdhani font-bold text-lg mb-2 shadow-sm
                ${isToday ? 'bg-primary text-white shadow-md' : 'text-gray-700 bg-gray-50 dark:bg-black/40 dark:text-gray-300 border border-gray-100 dark:border-white/10'}
                ${hasOrders && !isToday ? 'border-primary/30 text-primary dark:text-primary-light' : ''}
              `}>
                {day}
              </span>
              
              {hasOrders && (
                <div className="relative z-10 w-full flex-grow flex flex-col mt-2 overflow-hidden group-hover:overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                  
                  <div className="flex flex-col gap-1 group-hover:hidden w-full">
                    {orderProfiles.slice(0, 2).map((name, idx) => {
                      const shortName = name.length > 7 ? name.substring(0, 7) + "." : name;
                      return (
                        <span 
                          key={`s-${idx}`} 
                          title={name} 
                          className="inline-block whitespace-nowrap bg-primary/15 dark:bg-[#0a0a0a]/80 text-primary dark:text-primary-light border border-primary/20 dark:border-primary/40 px-1.5 py-px rounded-md text-[11px] md:text-[13px] font-rajdhani font-extrabold truncate w-full shadow-sm tracking-wide"
                        >
                          👤 {shortName}
                        </span>
                      );
                    })}
                    {orderProfiles.length > 2 && (
                      <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-0.5 ml-1">
                        +{orderProfiles.length - 2} kişi daha
                      </span>
                    )}
                  </div>
                  
                  <div className="hidden group-hover:flex flex-col gap-1.5 w-full pb-1">
                    {orderProfiles.map((name, idx) => {
                      const shortName = name.length > 8 ? name.substring(0, 8) + ".." : name;
                      return (
                        <span 
                          key={`f-${idx}`} 
                          title={name} 
                          className="inline-block whitespace-nowrap bg-primary/15 dark:bg-[#0a0a0a]/80 text-primary dark:text-primary-light border border-primary/20 dark:border-primary/40 px-1.5 py-0.5 rounded-md text-[11px] md:text-[13px] font-rajdhani font-extrabold truncate w-full shadow-sm tracking-wide"
                        >
                          👤 {shortName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}