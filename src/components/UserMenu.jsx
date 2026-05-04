"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 12,
        right: Math.max(window.innerWidth - rect.right, 16),
      });
    }
    setIsOpen(!isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        if (!event.target.closest('.user-menu-portal')) {
          setIsOpen(false);
        }
      }
    };

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  if (!user) return null;

  return (
    <div className="relative">
      {/* KULLANICI BUTONU - Daha şık ve şeffaf */}
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className="flex items-center gap-3 p-1.5 pr-5 rounded-full bg-white/40 dark:bg-white/[0.05] backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/[0.1] hover:shadow-apple-hover transition-all duration-500 group"
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary-light/30 shadow-inner group-hover:scale-105 transition-transform duration-500">
          <Image
            src={user.image || "/assets/avatar.jpg"}
            alt={user.firstName}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <span className="font-rajdhani font-bold text-base text-gray-800 dark:text-gray-100 uppercase tracking-wider hidden sm:block">
          {user.firstName}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 group-hover:text-primary transition-all duration-500 ${isOpen ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* AÇILAN MENÜ - Portal ile render ediliyor */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ position: "fixed", top: dropdownPos.top, right: dropdownPos.right }}
              className="user-menu-portal w-72 rounded-[32px] bg-white/80 dark:bg-black/80 backdrop-blur-3xl border border-white dark:border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden z-[2000]"
            >
              {/* Header / Profile Info */}
              <div className="px-8 py-6 flex flex-col items-center bg-gradient-to-b from-primary/5 to-transparent border-b border-gray-100/50 dark:border-white/5">
                <div className="relative w-16 h-16 rounded-3xl overflow-hidden border-2 border-primary-light shadow-xl mb-3">
                  <Image src={user.image || "/assets/avatar.jpg"} alt={user.firstName} fill sizes="64px" className="object-cover" />
                </div>
                <span className="font-bebas text-3xl text-gray-900 dark:text-white tracking-[0.1em]">{user.firstName} {user.lastName}</span>
              </div>

              <div className="p-3 flex flex-col gap-1.5">
                {/* Geçmiş */}
                <Link
                  href="/history"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-5 py-4 rounded-3xl hover:bg-primary/10 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-rajdhani font-bold text-lg text-gray-700 dark:text-gray-200 uppercase tracking-wider">Geçmiş Siparişler</span>
                </Link>

                {/* Tema */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-3xl hover:bg-primary/10 transition-all duration-300 group text-left"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-yellow-400/10 dark:bg-primary-light/10 rounded-2xl group-hover:bg-yellow-400 dark:group-hover:bg-primary-light transition-all duration-500">
                    {theme === "dark" ? (
                      <svg className="w-5 h-5 text-primary-light group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    ) : (
                      <svg className="w-5 h-5 text-yellow-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    )}
                  </div>
                  <span className="font-rajdhani font-bold text-lg text-gray-700 dark:text-gray-200 uppercase tracking-wider">{theme === "dark" ? "Gündüz Modu" : "Gece Modu"}</span>
                </button>

                <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-4" />

                {/* Logout */}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-3xl hover:bg-red-500/10 transition-all duration-300 group text-left"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-red-500/10 rounded-2xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </div>
                  <span className="font-rajdhani font-bold text-lg text-red-500 uppercase tracking-wider">Oturumu Kapat</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
