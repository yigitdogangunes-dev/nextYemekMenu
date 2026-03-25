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
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: type === "error" ? "#ff4444" : "#ffcc00",
      color: type === "error" ? "#fff" : "#000",
      padding: '15px 25px',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontFamily: 'var(--font-rajdhani)',
      fontSize: '20px',
      zIndex: 99999,
      boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {type === "error" ? "⚠️ " : "✅ "} {message}
      
      {/* Sağdan kayarak gelme animasyonu */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}