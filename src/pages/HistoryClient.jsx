"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "@/components/Calendar";
import { useRecords } from "@/hooks/useRecords";
import ConfirmModal from "@/components/ConfirmModal";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import { generateExpenseReport } from "@/utils/pdfGenerator";

export default function HistoryClient() {
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // MODALLAR
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ date: "", records: [] });
  const [confirmData, setConfirmData] = useState({ isOpen: false, date: null, index: null });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const {
    records,
    deleteRecord,
    monthlyTotals,
    hasAnyRecordThisMonth,
    grandTotal
  } = useRecords(currentDate);

  const handleDayClick = (clickedDate, dayRecords) => {
    setModalData({ date: clickedDate, records: dayRecords });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (date, index) => {
    setConfirmData({ isOpen: true, date: date, index: index });
  };

  const executeDelete = async () => {
    const updatedDayRecords = await deleteRecord(confirmData.date, confirmData.index);
    if (updatedDayRecords !== false) {
      setModalData(prev => ({ ...prev, records: updatedDayRecords }));
      setToast({ show: true, message: "Kayıt başarıyla silindi.", type: "success" });
    } else {
      setToast({ show: true, message: "Eyvah! Silme işlemi başarısız.", type: "error" });
    }
    setConfirmData({ isOpen: false, date: null, index: null });
  };

  const handleDownloadPdf = () => {
    if (!hasAnyRecordThisMonth) return;
    setIsPdfGenerating(true);
    
    setTimeout(async () => {
      try {
        await generateExpenseReport(records, monthlyTotals, currentDate);
      } catch (error) {
        console.error("PDF Oluşturma hatası:", error);
        setToast({ show: true, message: "PDF oluşturulurken bir hata oluştu.", type: "error" });
      } finally {
        setIsPdfGenerating(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-primary-light selection:text-white font-sans text-foreground">
      <ThemeToggle />

      {/* ARKA PLAN TASARIMI */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-background transition-colors duration-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-background to-[#e5e5ea] dark:hidden transition-colors duration-700"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary-light/10 blur-[200px] dark:hidden transition-colors duration-700" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#34c759]/5 blur-[200px] dark:hidden transition-colors duration-700" />

        <div className="hidden dark:block absolute inset-0 bg-[#0a0a0a] transition-colors duration-700 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full blur-[180px]" style={{ background: 'rgba(99, 102, 241, 0.15)' }} />
          <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[160px]" style={{ background: 'rgba(139, 92, 246, 0.12)' }} />
          <div className="absolute bottom-[-15%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[200px]" style={{ background: 'rgba(59, 130, 246, 0.1)' }} />
        </div>

        <div className="absolute inset-0 z-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      </div>

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-4 pt-10 pb-24"
      >
        {/* BAŞLIK VE GERİ BUTONU */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="group flex items-center gap-4 bg-white/70 dark:bg-[#111111]/80 backdrop-blur-xl px-6 py-4 rounded-[24px] border border-gray-200 dark:border-white/10 shadow-sm hover:border-transparent dark:hover:border-transparent hover:shadow-apple dark:hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all overflow-hidden relative">
            <div className="absolute inset-y-0 right-0 w-0 bg-gradient-to-l from-primary-dark to-primary transition-all duration-500 ease-out group-hover:w-full z-0" />
            <div className="relative z-10 text-gray-800 dark:text-white transform group-hover:-translate-x-1 group-hover:text-white transition-all duration-300">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="relative z-10 font-rajdhani text-2xl font-bold text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300">Ana Ekrana Dön</span>
          </Link>

          <h1 className="hidden md:block font-fugaz text-[40px] text-gray-400 dark:text-gray-500 uppercase tracking-widest drop-shadow-sm opacity-50">
            HARCAMALAR
          </h1>
        </div>

        {/* TAKVİM VE ÖZET TABLOSU */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* TAKVİM BÖLÜMÜ (Geniş ekranlarda 2 sütun kaplar) */}
          <div className="lg:col-span-2">
            <Calendar
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              records={records}
              onDayClick={handleDayClick}
              min="2026-01-01"
            />
          </div>

          {/* TOPLAM HARCAMA KARTI */}
          <div className="lg:col-span-1 bg-white/70 dark:bg-[#111111]/80 backdrop-blur-3xl border border-gray-100 dark:border-white/10 shadow-apple dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[40px] p-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-primary-dark opacity-80" />

            <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-4 mb-8">
              <h2 className="font-bebas text-4xl text-gray-800 dark:text-white tracking-widest mt-2">
                HARCAMA ÖZETİ
              </h2>
              
              {/* PDF İndirme Butonu */}
              <button 
                onClick={handleDownloadPdf}
                disabled={!hasAnyRecordThisMonth || isPdfGenerating}
                className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:border-primary-light/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Aylık Dökümü İndir (PDF)"
              >
                {isPdfGenerating ? (
                  <span className="w-5 h-5 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-300">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <polyline points="9 15 12 18 15 15" />
                  </svg>
                )}
              </button>
            </div>

            {!hasAnyRecordThisMonth ? (
              <p className="text-center text-gray-500 dark:text-gray-400 font-rajdhani text-xl italic pt-4">
                Bu ay için henüz hiçbir harcama kaydı bulunmamaktadır.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {Object.entries(monthlyTotals).map(([profileName, totalAmount], idx) => (
                  <div key={profileName} className="flex justify-between items-center bg-gray-50/50 dark:bg-[#0a0a0a]/50 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <span className="font-rajdhani text-2xl font-bold text-gray-700 dark:text-gray-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light text-xl">👤</div>
                      {profileName}
                    </span>
                    <span className="font-rajdhani text-3xl font-extrabold text-gray-800 dark:text-primary-light">
                      {totalAmount} ₺
                    </span>
                  </div>
                ))}

                <div className="mt-4 pt-6 flex justify-between items-center border-t-2 border-dashed border-primary/40 bg-primary/5 dark:bg-primary-dark/10 rounded-3xl p-6">
                  <span className="font-bebas text-3xl text-gray-800 dark:text-white tracking-widest">GENEL TOPLAM</span>
                  <span className="font-rajdhani text-4xl font-extrabold text-primary dark:text-primary-light drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                    {grandTotal} ₺
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ADİSYON (GÜN DETAYI) MODALI */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md px-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-[30px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-light via-primary to-primary-dark" />

              <div className="relative p-8 pb-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-center">
                <h3 className="font-bebas text-4xl text-gray-800 dark:text-white tracking-widest uppercase text-center">
                  {modalData.date ? modalData.date.split('-').reverse().join('.') : ""}  TARİHLİ SİPARİŞLER
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-8 w-12 h-12 bg-gray-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/20 text-gray-500 dark:text-gray-400 hover:text-red-500 rounded-[18px] flex items-center justify-center transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
                {modalData.records.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 dark:text-gray-500 font-rajdhani text-2xl font-bold">
                    Bugüne ait bir seçim bulunmuyor.
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {modalData.records.map((record, index) => {
                      const dailyTotal = record.items.reduce((sum, food) => sum + Number(food.price), 0);

                      return (
                        <div key={index} className="relative bg-gray-50 dark:bg-[#111111] border-l-4 border-primary rounded-2xl p-6 shadow-sm group">

                          <button
                            onClick={() => handleDeleteClick(modalData.date, index)}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors opacity-100 dark:opacity-100"
                            title="Siparişi İptal Et"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </button>

                          <div className="font-rajdhani text-3xl font-extrabold text-primary dark:text-primary-light mb-6 flex items-center gap-2">
                            👤 {record.profile}
                          </div>

                          <div className="flex flex-col gap-3 mb-6">
                            {record.items.map((food, foodIdx) => (
                              <div key={foodIdx} className="flex justify-between items-center font-rajdhani text-2xl text-gray-700 dark:text-gray-300">
                                <span>
                                  <span className="text-gray-400 mr-2">•</span>
                                  {food.name}
                                  {food.portion ? (
                                    <span className="text-gray-400 dark:text-gray-500 text-xl ml-2">
                                      (x{food.portion})
                                    </span>
                                  ) : ''}
                                </span>
                                <span className="font-bold">{food.price} ₺</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end items-center border-t border-gray-200 dark:border-white/10 pt-4 font-rajdhani text-3xl font-extrabold text-gray-800 dark:text-white">
                            Toplam: <span className="text-primary dark:text-primary-light ml-2">{dailyTotal} ₺</span>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmData.isOpen}
        message="Bu siparişi silmek istediğinize emin misiniz?"
        onCancel={() => setConfirmData({ isOpen: false, date: null, index: null })}
        onConfirm={executeDelete}
      />

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