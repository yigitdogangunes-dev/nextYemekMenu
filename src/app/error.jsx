"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ error, reset }) {
  
  useEffect(() => {
    // Hatayı konsola yazdırıyoruz ki geliştirici (biz) ne olduğunu görelim
    console.error("Beklenmedik bir hata oluştu:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden px-4">
      
      {/* Background Orbs (Error specific - subtle Red/Violet) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Animated Error Icon */}
        <motion.div
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: "spring", stiffness: 260, damping: 20 }}
           className="w-24 h-24 bg-red-500/10 rounded-[30px] flex items-center justify-center mb-8 border border-red-500/20"
        >
          <AlertTriangle className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        </motion.div>

        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h2 className="font-bebas text-4xl md:text-5xl text-foreground tracking-widest uppercase mb-4">
            Mutfakta İşler Biraz Karıştı
          </h2>
          <p className="font-rajdhani text-xl md:text-2xl text-gray-400 dark:text-gray-500 max-w-md mx-auto mb-12 font-medium">
            Kısa süreli bir aksaklık yaşıyoruz. Endişelenmeyin, verileriniz güvende!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <motion.button
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => reset()}
             className="group relative flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-[24px] border border-primary shadow-apple hover:shadow-apple-hover transition-all overflow-hidden duration-500"
          >
            <RefreshCw className="w-6 h-6 animate-spin-slow group-hover:rotate-180 transition-transform duration-700" />
            <span className="relative z-10 font-bebas text-2xl md:text-3xl tracking-widest">
              Tekrar Dene
            </span>
          </motion.button>

          <motion.a
             href="/"
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.3 }}
             whileHover={{ scale: 1.05 }}
             className="px-10 py-5 font-bebas text-2xl md:text-3xl tracking-widest text-gray-500 dark:text-gray-400 hover:text-foreground transition-colors"
          >
            Ana Sayfa
          </motion.a>
        </div>

      </div>

      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-primary to-primary-dark opacity-30" />
    </div>
  );
}