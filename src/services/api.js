const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const getOptions = (method = "GET", body = null) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include" 
  };
  if (body) options.body = JSON.stringify(body);
  return options;
};

export const API = {
  // --- KİMLİK DOĞRULAMA (AUTH) ---
  
  // Login artık e-posta ile yapılıyor
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, getOptions("POST", credentials));
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Giriş başarısız!");
    return data;
  },

  // Yeni Kayıt
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, getOptions("POST", userData));
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Kayıt başarısız!");
    return data;
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, getOptions("POST"));
    return response.json();
  },

  me: async () => {
    const response = await fetch(`${API_URL}/auth/me`, getOptions("GET"));
    if (!response.ok) throw new Error("Oturum bulunamadı");
    return response.json();
  },

  // Şifremi Unuttum
  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, getOptions("POST", { email }));
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "E-posta gönderilemedi");
    return data;
  },

  // Şifre Sıfırla
  resetPassword: async (token, password) => {
    const response = await fetch(`${API_URL}/auth/reset-password/${token}`, getOptions("POST", { password }));
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Şifre sıfırlanamadı");
    return data;
  },

  // --- KAYIT (RECORDS) İŞLEMLERİ ---
  getRecords: async () => {
    const response = await fetch(`${API_URL}/records`, getOptions());
    if (!response.ok) throw new Error("Sunucu hatası");
    return response.json();
  },
  saveOrder: async (orderData) => {
    const response = await fetch(`${API_URL}/records`, getOptions("POST", orderData));
    return response.json();
  },
  checkExistingOrder: async (date, user) => {
    const response = await fetch(`${API_URL}/records?date=${encodeURIComponent(date)}&user=${encodeURIComponent(user)}`, getOptions());
    return response.json();
  },
  deleteOrder: async (id) => {
    const response = await fetch(`${API_URL}/records/${id}`, getOptions("DELETE"));
    return response.json();
  },

  // --- MENÜ (MENUS) VE YEMEK HAVUZU (FOODS) İŞLEMLERİ ---
  getMenuByDate: async (date) => {
    const response = await fetch(`${API_URL}/menus?date=${date}`, getOptions());
    return response.json();
  },
  getAllFoods: async () => {
    const response = await fetch(`${API_URL}/allFoods`, getOptions());
    return response.json();
  },
  saveDailyMenu: async (menuData) => {
    const response = await fetch(`${API_URL}/menus`, getOptions("POST", menuData));
    return response.json();
  },

  // --- KULLANICI (USERS) İŞLEMLERİ ---
  getUsers: async () => {
    const response = await fetch(`${API_URL}/users`, getOptions());
    if (!response.ok) throw new Error("Kullanıcılar getirilemedi");
    return response.json();
  }
};