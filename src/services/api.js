const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const API = {
  // --- KAYIT (RECORDS) İŞLEMLERİ ---
  getRecords: async () => {
    const response = await fetch(`${API_URL}/records`);
    if (!response.ok) throw new Error("Sunucu hatası");
    return response.json();
  },
  saveOrder: async (orderData) => {
    const response = await fetch(`${API_URL}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },
  checkExistingOrder: async (date, profile) => {
    const response = await fetch(`${API_URL}/records?date=${encodeURIComponent(date)}&profile=${encodeURIComponent(profile)}`);
    return response.json();
  },
  deleteOrder: async (id) => {
    const response = await fetch(`${API_URL}/records/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // --- MENÜ (MENUS) VE YEMEK HAVUZU (FOODS) İŞLEMLERİ ---
  getMenuByDate: async (date) => {
    const response = await fetch(`${API_URL}/menus?date=${date}`);
    return response.json();
  },
  getAllFoods: async () => {
    const response = await fetch(`${API_URL}/allFoods`);
    return response.json();
  },
  saveDailyMenu: async (menuData) => {
    const response = await fetch(`${API_URL}/menus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menuData),
    });
    return response.json();
  }
};