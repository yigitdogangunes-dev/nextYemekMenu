// src/utils/storage.js
import { API } from "@/services/api";

// Yeni siparişi alıp API servisi üzerinden mutfağa gönderen motor
export const saveOrderToStorage = async (date, profile, foods) => {
  try {
    // 1. Önce Şef Garson'a soralım: "Bugün bu profile ait eski bir sipariş var mı?"
    const existingRecords = await API.checkExistingOrder(date, profile);

    // 2. Eğer varsa, o eski siparişi silelim
    if (existingRecords.length > 0) {
      const oldRecordId = existingRecords[0].id;
      await API.deleteOrder(oldRecordId);
    }

    // 3. Şimdi yepyeni siparişimizi kaydetmesi için Şef Garson'a verelim
    await API.saveOrder({
      date: date,
      profile: profile,
      foods: foods
    });

  } catch (error) {
    console.error("Eyvah, mutfakla telsiz bağlantısı koptu !", error);
  }
};