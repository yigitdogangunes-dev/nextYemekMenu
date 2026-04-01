"use client";
import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    // 3 saniye sonra otomatik kapanma motoru
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed top-5 right-5 px-8 py-4 rounded-2xl font-rajdhani text-xl font-bold z-[99999] shadow-2xl transition-all animate-slideIn backdrop-blur-md border border-white/20
        ${type === "error" 
          ? "bg-red-500 text-white shadow-red-500/20" 
          : "bg-primary text-white shadow-primary/20"
        }`}
    >
      {type === "error" ? "⚠️ " : "✅ "} {message}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}