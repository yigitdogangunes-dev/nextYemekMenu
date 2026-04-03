// src/utils/storage.js
import { API } from "@/services/api";

// Yeni siparişi alıp API servisi üzerinden mutfağa gönderen motor
export const saveOrderToStorage = async (date, profile, items) => {
  try {
    // Backend tarafında UPSERT (Var olanı güncelle, yoksa ekle) mantığı kurulduğu için 
    // artık önce kontrol edip tek tek silmemize gerek kalmadı. 
    // Direkt gönderiyoruz, backend hallediyor.
    await API.saveOrder({
      date: date,
      profile: profile,
      items: items
    });

  } catch (error) {
    console.error("Eyvah, mutfakla telsiz bağlantısı koptu!", error);
    throw error;
  }
};