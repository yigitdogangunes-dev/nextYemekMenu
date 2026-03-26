import { useState, useEffect } from "react";

export const useRecords = (currentDate) => {
  // Verileri mutfaktan çekip burada tutacağız
  const [rawRecords, setRawRecords] = useState([]);

  // 1. MUTFAKTAN VERİLERİ ÇEKME MOTORU (GET)
  const fetchRecords = async () => {
    try {
      const response = await fetch("http://localhost:4000/records");
      const data = await response.json();
      setRawRecords(data); // Gelen veriyi hafızaya al
    } catch (error) {
      console.error("Muhasebeci mutfağa bağlanamadı patron:", error);
    }
  };

  // Dükkan açıldığında veya ay/tarih değiştiğinde verileri yenile
  useEffect(() => {
    fetchRecords();
  }, [currentDate]);

  // 2. GELEN VERİYİ TAKVİMİN İSTEDİĞİ FORMATA ÇEVİR
  const records = {};
  rawRecords.forEach(item => {
    if (!records[item.date]) {
      records[item.date] = [];
    }
    records[item.date].push({
      id: item.id, // SİLMEK İÇİN BU ID ÇOK ÖNEMLİ ARTIK!
      profil: item.profile,
      yemekler: item.foods
    });
  });

  // 3. SİLME MOTORU (DELETE)
  const deleteRecord = async (date, index) => {
    // UI bize tarih ve sıra numarası veriyor. Biz o kaydın ID'sini buluyoruz.
    const recordToDelete = records[date][index];
    if (!recordToDelete || !recordToDelete.id) return false;

    try {
      // Mutfağa "Bu ID'li siparişi yok et" diyoruz
      await fetch(`http://localhost:4000/records/${recordToDelete.id}`, {
        method: "DELETE"
      });

      // Başarıyla silindiyse, mutfaktaki yeni listeyi tekrar çek
      fetchRecords();

      // UI'daki açık olan onay kutusunu (Modal) güncellemek için kalanları döndür
      const updatedDayRecords = records[date].filter((_, i) => i !== index);
      return updatedDayRecords;

    } catch (error) {
      console.error("Silme hatası:", error);
      return false;
    }
  };

  // 4. AYLIK TOPLAM HESAPLAMALARI (Senin eski kusursuz matematiğin)
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

  return { records, deleteRecord, monthlyTotals, hasAnyRecordThisMonth, grandTotal };
};