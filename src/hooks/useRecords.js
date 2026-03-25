"use client";
import { useState, useEffect } from "react";

export function useRecords(currentDate) {
  const [records, setRecords] = useState({});

  // 1. VERİLERİ ÇEKME MOTORU
  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem('yemekKayitlari')) || {};
    setRecords(savedRecords);
  }, []);

  // 2. SİLME MOTORU
  // const deleteRecord = (date, indexToDelete) => {
  //   const onay = window.confirm("Bu siparişi silmek istediğinize emin misiniz?");
  //   if (!onay) return false; // İptal ederse false dön

  //   const updatedRecords = { ...records };
  //   updatedRecords[date] = updatedRecords[date].filter((_, idx) => idx !== indexToDelete);

  //   if (updatedRecords[date].length === 0) {
  //     delete updatedRecords[date];
  //   }

  //   setRecords(updatedRecords);
  //   localStorage.setItem('yemekKayitlari', JSON.stringify(updatedRecords));
    
  //   // Silindikten sonra o günün güncel halini döndürüyoruz ki Modal da kendini güncellesin
  //   return updatedRecords[date] || []; 
  // };
  
  const deleteRecord = (date, indexToDelete) => {
    const updatedRecords = { ...records };
    updatedRecords[date] = updatedRecords[date].filter((_, idx) => idx !== indexToDelete);

    if (updatedRecords[date].length === 0) {
      delete updatedRecords[date];
    }

    setRecords(updatedRecords);
    localStorage.setItem('yemekKayitlari', JSON.stringify(updatedRecords));
    
    return updatedRecords[date] || []; 
  };

  // 3. AYLIK TOPLAM HESAPLAMA MOTORU
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const formattedMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  const monthlyTotals = {};
  let hasAnyRecordThisMonth = false;

  Object.keys(records).forEach(date => {
    if (date.startsWith(formattedMonthPrefix)) {
      records[date].forEach(record => {
        hasAnyRecordThisMonth = true;
        const profile = record.profil;
        
        let dailyTotal = 0;
        record.yemekler.forEach(food => {
          dailyTotal += Number(food.price);
        });

        if (!monthlyTotals[profile]) monthlyTotals[profile] = 0;
        monthlyTotals[profile] += dailyTotal;
      });
    }
  });

  // 4. GENEL TOPLAM
  const grandTotal = Object.values(monthlyTotals).reduce((sum, amount) => sum + amount, 0);

  // Sayfaya (Garsona) sadece şu sonuçları teslim et:
  return {
    records,
    deleteRecord,
    monthlyTotals,
    hasAnyRecordThisMonth,
    grandTotal
  };
}