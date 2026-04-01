"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={onCancel}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-md bg-white dark:bg-[#111111] rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_rgba(139,92,246,0.15)] border border-gray-200 dark:border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center pt-10">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <p className="font-rajdhani text-2xl font-bold text-gray-800 dark:text-gray-200">
                {message}
              </p>
            </div>
            
            <div className="flex border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0a]">
              <button 
                onClick={onCancel}
                className="w-1/2 py-5 font-rajdhani text-2xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
              >
                İPTAL
              </button>
              <div className="w-[1px] bg-gray-200 dark:bg-white/10"></div>
              <button 
                onClick={onConfirm}
                className="w-1/2 py-5 font-rajdhani text-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
              >
                SİL
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}