"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ProfileSelector from "@/components/ProfileSelector";
import MenuBoard from "@/components/MenuBoard";
import Toast from "@/components/Toast";
import ThemeToggle from "@/components/ThemeToggle";
import DatePicker from "@/components/DatePicker";
import { getTodayFormatted } from "@/utils/date";
import { saveOrderToStorage } from "@/utils/storage";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(getTodayFormatted());
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSave = async () => {
    if (!selectedProfile) {
      setToast({ show: true, message: "Lütfen seçimleri kaydetmeden önce yukarıdan bir profil seçin!", type: "error" });
      return;
    }

    try {
      await saveOrderToStorage(selectedDate, selectedProfile, selectedFoods);

      setToast({ show: true, message: `Şahane! Seçimleriniz ${selectedProfile} profiline kaydedildi.`, type: "success" });

      setSelectedProfile(null);
      setSelectedFoods([]);

      // State güncellemelerinden (React render) sonra kaydırma işleminin kesilmemesi için ufak bir bekleme
      setTimeout(() => {
        const el = document.getElementById("menu-baslangici");
        if (el) {
          const yOffset = -30;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 150);

    } catch (error) {
      setToast({ show: true, message: "Kaydedilirken bir hata oluştu!", type: "error" });
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-primary-light selection:text-white font-sans text-foreground">

      {!isScrolled && <ThemeToggle />}

      {/* STICKY FLOATING SCROLL NAVBAR */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-0 left-0 w-full z-[100] px-4 py-3 lg:py-4 bg-white/80 dark:bg-[#0a0a0a]/70 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 shadow-glass-heavy dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-b-[24px] overflow-hidden"
          >
            <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">

              {/* COMPACT LOGO & TITLE */}
              <div
                className="flex items-center gap-1 cursor-pointer group scale-[1.1] md:scale-100 origin-left shrink-0"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Yukarı Git"
              >
                <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px] transform transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src="/assets/svgexport-1.svg"
                    alt="Kodpilot Logo"
                    fill
                    className="object-contain drop-shadow-sm opacity-90 dark:drop-shadow-[0_0_15px_rgba(255,204,0,0.6)] dark:filter-none dark:invert brightness-0 dark:brightness-100"
                    priority
                  />
                </div>
                <h1 className="hidden lg:block font-fugaz text-[36px] md:text-[42px] bg-gradient-to-b from-primary-light dark:from-white via-primary dark:via-primary-light to-primary-dark dark:to-primary-dark bg-clip-text text-transparent uppercase tracking-[0.15em] font-extrabold translate-y-1">
                  YEMEK
                </h1>
              </div>

              {/* RIGHT SECTION: DATE & THEME */}
              <div className="flex items-center gap-4 md:gap-6">
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  min="2026-01-01"
                  max={getTodayFormatted()}
                  compact
                />

                <div className="w-[1px] h-10 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

                <ThemeToggle isInline={true} />
              </div>

            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-primary-dark opacity-80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-background transition-colors duration-700">

        {/* LIGHT THEME MESH */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-background to-[#e5e5ea] dark:hidden transition-colors duration-700"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary-light/10 blur-[200px] dark:hidden transition-colors duration-700" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#34c759]/5 blur-[200px] dark:hidden transition-colors duration-700" />

        {/* DARK THEME MESH (Original Kodpilot Logic) */}
        <div className="hidden dark:block absolute inset-0 bg-[#0a0a0a] transition-colors duration-700 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full blur-[180px]" style={{ background: 'rgba(99, 102, 241, 0.15)' }} />
          <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[160px]" style={{ background: 'rgba(139, 92, 246, 0.12)' }} />
          <div className="absolute bottom-[-15%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[200px]" style={{ background: 'rgba(59, 130, 246, 0.1)' }} />
        </div>

        {/* Subtle dot pattern for premium texture */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      </div>

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-4 pt-10 pb-24"
      >
        {/* HERO HEADER */}
        {/* Clean Frosted Glassmorphism Card */}
        <div className="relative p-8 lg:p-12 rounded-[40px] bg-white/70 dark:bg-white/[0.03] backdrop-blur-3xl border border-white dark:border-white/10 shadow-apple dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden mb-16 transition-all duration-700">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-primary-dark opacity-80" />

          <div className="w-full max-w-[1150px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 z-10 relative">

            {/* LOGO & TITLE SECTION */}
            <div className="flex flex-col items-center md:items-start group transition-all duration-700">
              <div className="relative w-[200px] h-[60px] md:w-[240px] md:h-[75px] mb-2 transform transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/assets/svgexport-1.svg"
                  alt="Kodpilot Logo"
                  fill
                  className="object-contain drop-shadow-sm opacity-90 dark:drop-shadow-[0_0_35px_rgba(255,204,0,0.6)] dark:filter-none dark:invert brightness-0 dark:brightness-100 transition-all duration-700"
                  priority
                />
              </div>
              <h1 className="font-fugaz text-[60px] md:text-[70px] leading-tight bg-gradient-to-b from-primary-light dark:from-white via-primary dark:via-primary-light to-primary-dark dark:to-primary-dark bg-clip-text text-transparent uppercase tracking-[0.16em] font-extrabold translate-x-[0.06em] -mt-2 md:-mt-4 drop-shadow-2xl transition-all duration-700">
                YEMEK
              </h1>
            </div>

            {/* DATE SELECTOR SECTION */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <label className="font-bebas text-3xl text-gray-600 dark:text-gray-400 tracking-widest uppercase mb-1 transition-colors duration-700">
                Servis Tarihi
              </label>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                min="2026-01-01"
                max={getTodayFormatted()}
              />
            </div>

          </div>
        </div>

        {/* PROFILE SELECTOR */}
        <div id="menu-baslangici" className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ProfileSelector
              selectedProfile={selectedProfile}
              setSelectedProfile={setSelectedProfile}
            />
          </motion.div>
        </div>

        {/* MENU BOARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <MenuBoard
            date={selectedDate}
            selectedFoods={selectedFoods}
            setSelectedFoods={setSelectedFoods}
          />
        </motion.div>

        {/* FOOTER NAVIGATION */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/history"
            className="group relative inline-flex items-center justify-center px-14 py-5 font-rajdhani text-3xl font-bold bg-transparent dark:bg-[#111111] border-2 border-gray-300 dark:border-primary-dark/40 rounded-[24px] dark:rounded-3xl overflow-hidden transition-all hover:border-transparent dark:hover:shadow-[0_0_40px_rgba(139,92,246,0.25)] hover:-translate-y-1 dark:hover:scale-[1.03]"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black dark:block hidden" />
            <span className="relative uppercase tracking-widest z-30 transition-all duration-300 text-gray-500 dark:text-primary-light group-hover:text-white group-hover:opacity-100 antialiased outline-none">Geçmiş Harcamalar</span>
            <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-primary-dark to-primary transition-all duration-500 ease-out group-hover:w-full z-0" />
          </Link>
        </div>

      </motion.div>

      {/* DYNAMIC ISLAND FLOATING BAR */}
      <AnimatePresence>
        {selectedFoods.length > 0 && (
          <motion.div
            initial={{ y: 200, x: "-50%", scale: 0.9 }}
            animate={{ y: -40, x: "-50%", scale: 1 }}
            exit={{ y: 200, x: "-50%", scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-0 left-1/2 z-[100] flex justify-center transform-gpu"
            style={{ x: "-50%" }}
          >
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center justify-center bg-white/70 dark:bg-black/60 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-full h-16 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-apple-hover transition-shadow duration-500 overflow-hidden px-6 min-w-[300px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light/10 via-primary/20 to-primary-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* State 1: Default Information */}
              <div className="relative z-10 flex items-center justify-between gap-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform group-hover:scale-90 group-hover:-translate-y-16 group-hover:opacity-0 w-full">
                <div className="flex items-center gap-3">
                  <motion.div
                    key={selectedFoods.length}
                    initial={{ scale: 1.5, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center border border-primary/20 shrink-0"
                  >
                    <span className="font-bebas text-2xl text-primary mt-1">
                      {selectedFoods.length}
                    </span>
                  </motion.div>
                  <span className="font-rajdhani text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300">
                    Seçim Yapıldı
                  </span>
                </div>

                <div className="h-8 w-px bg-gray-300 dark:bg-white/20"></div>

                <span className="font-rajdhani text-2xl sm:text-[28px] font-extrabold text-gray-900 dark:text-white tracking-widest">
                  {selectedFoods.reduce((sum, food) => sum + Number(food.price), 0)} ₺
                </span>
              </div>

              {/* State 2: Hover Action text */}
              <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform translate-y-16 scale-90 opacity-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 px-8 w-full">
                <span className="font-bebas text-3xl tracking-widest text-gray-900 dark:text-white whitespace-nowrap mt-1">
                  SİPARİŞİ ONAYLA
                </span>
                <svg className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Toast Notification Fixed */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}