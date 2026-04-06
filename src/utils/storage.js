// src/utils/storage.js
import { API } from "@/services/api";

// Yeni siparişi alıp API servisi üzerinden mutfağa gönderen motor
export const saveOrderToStorage = async (date, user, items) => {
  try {
    const formattedItems = items.map(item => ({
      food: item.food,       // Yemeğin _id'si
      portion: item.portion,
      price: item.price
    }));
    await API.saveOrder({
      date: date,
      user: user,
      items: formattedItems
    });

  } catch (error) {
    console.error("Eyvah, mutfakla telsiz bağlantısı koptu!", error);
    throw error;
  }
};