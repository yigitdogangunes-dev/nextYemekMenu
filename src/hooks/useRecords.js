// src/hooks/useRecords.js
import useSWR from "swr";
import { API } from "@/services/api";

export const useRecords = (currentDate) => {
  // İŞTE SWR BÜYÜSÜ! Tek satırda veri çekme, önbelleğe alma ve hata kontrolü:
  // 1. Parametre: SWR'nin bu veriyi hafızada hangi isimle (key) tutacağı (biz '/records' dedik)
  // 2. Parametre: Veriyi gidip mutfaktan alacak olan Şef Garson fonksiyonumuz
  const { data: rawRecords, error, isLoading, mutate } = useSWR('/records', API.getRecords);

  // 1. GELEN VERİYİ TAKVİMİN İSTEDİĞİ FORMATA ÇEVİR
  const records = {};
  
  // Veri daha gelmediyse (yükleniyorsa) veya hata varsa boş obje ile sistemi koruyoruz
  if (rawRecords) {
    rawRecords.forEach(item => {
      if (!records[item.date]) {
        records[item.date] = [];
      }
      records[item.date].push({
        id: item.id, 
        profil: item.profile,
        yemekler: item.foods
      });
    });
  }

  // 2. SİLME MOTORU (DELETE)
  const deleteRecord = async (date, index) => {
    const recordToDelete = records[date][index];
    if (!recordToDelete || !recordToDelete.id) return false;

    try {
      // Şef Garson'a sildir
      await API.deleteOrder(recordToDelete.id);

      // SWR'ye "Veritabanı değişti, arka planda çaktırmadan yeni listeyi çek" emrini veriyoruz (MUTATE)
      mutate(); 

      const updatedDayRecords = records[date].filter((_, i) => i !== index);
      return updatedDayRecords;
    } catch (err) {
      console.error("Silme hatası:", err);
      return false;
    }
  };

  // 3. AYLIK TOPLAM HESAPLAMALARI
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const monthlyTotals = {};
  let grandTotal = 0;
  let hasAnyRecordThisMonth = false;

  Object.keys(records).forEach(date => {
    const [yearStr, monthStr] = date.split('-');
    const recordMonth = parseInt(monthStr, 10);
    const recordYear = parseInt(yearStr, 10);

    if (recordMonth === currentMonth && recordYear === currentYear) {
      hasAnyRecordThisMonth = true;
      records[date].forEach(record => {
        const dailyTotal = record.yemekler.reduce((sum, food) => sum + Number(food.price), 0);
        if (!monthlyTotals[record.profil]) {
          monthlyTotals[record.profil] = 0;
        }
        monthlyTotals[record.profil] += dailyTotal;
        grandTotal += dailyTotal;
      });
    }
  });

  // İhtiyacımız olan her şeyi arayüze (HistoryClient) gönderiyoruz
  return { 
    records, 
    deleteRecord, 
    monthlyTotals, 
    hasAnyRecordThisMonth, 
    grandTotal,
    isLoading, // SWR'den gelen yüklenme durumu
    error      // SWR'den gelen hata durumu
  };
};