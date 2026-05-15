"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminClient() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("users"); // "users" | "foods" | "pricing"

  // Data states
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [pricingTiers, setPricingTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Delete Confirm Modal
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", id: null, message: "" });

  // Form states
  const [showUserForm, setShowUserForm] = useState(false);
  const [userFormData, setUserFormData] = useState({ firstName: "", lastName: "", email: "", role: "employee" });

  const [showFoodForm, setShowFoodForm] = useState(false);
  const [foodFormData, setFoodFormData] = useState({ name: "", price: 0, category: "mainCourse", image: "/assets/placeholder.png" });

  const [editingFood, setEditingFood] = useState(null);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [todayMenuFoodIds, setTodayMenuFoodIds] = useState(new Set());
  const [showOnlyToday, setShowOnlyToday] = useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Users
      const usersRes = await fetch(`${API_URL}/users`, {
        credentials: "include"
      });
      if (usersRes.ok) {
        setUsers(await usersRes.json());
      }

      // Fetch Foods (all=true to get passive as well)
      const foodsRes = await fetch(`${API_URL}/allFoods?all=true`, {
        credentials: "include"
      });
      if (foodsRes.ok) {
        const foodsData = await foodsRes.json();
        // Flatten the categorized foods
        const allFoods = [];
        Object.keys(foodsData).forEach(cat => {
          allFoods.push(...foodsData[cat]);
        });
        setFoods(allFoods);
      }

      // Fetch Today's Menu
      const todayDate = new Date().toISOString().split("T")[0];
      const menuRes = await fetch(`${API_URL}/menus?date=${todayDate}`, {
        credentials: "include"
      });
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        if (menuData.length > 0) {
          const menu = menuData[0];
          const foodIds = new Set([
            ...(menu.soup || []).map(f => f._id || f),
            ...(menu.mainCourse || []).map(f => f._id || f),
            ...(menu.side || []).map(f => f._id || f),
            ...(menu.cold || []).map(f => f._id || f),
            ...(menu.dessert || []).map(f => f._id || f),
          ]);
          setTodayMenuFoodIds(foodIds);
        }
      }

      // Fetch Pricing Tiers
      const pricingRes = await fetch(`${API_URL}/pricing-tiers`, {
        credentials: "include"
      });
      if (pricingRes.ok) {
        setPricingTiers(await pricingRes.json());
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      showToast("Veriler yüklenemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- USER ACTIONS ---
  const handleUserStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "passive" : "active";
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
        showToast("Kullanıcı durumu güncellendi.");
      } else {
        showToast("Güncelleme başarısız.", "error");
      }
    } catch (error) {
      showToast("Sunucu hatası.", "error");
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        showToast("Kullanıcı rolü güncellendi.");
      } else {
        showToast("Güncelleme başarısız.", "error");
      }
    } catch (error) {
      showToast("Sunucu hatası.", "error");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userFormData)
      });
      if (res.ok) {
        const newUser = await res.json();
        setUsers([...users, newUser]);
        setShowUserForm(false);
        setUserFormData({ firstName: "", lastName: "", email: "", role: "employee" });
        showToast("Kullanıcı oluşturuldu.");
      } else {
        const errorData = await res.json();
        showToast(errorData.message || "Oluşturma başarısız.", "error");
      }
    } catch (error) {
      showToast("Sunucu hatası.", "error");
    }
  };

  const requestDeleteUser = (userId, name) => {
    setConfirmModal({
      isOpen: true,
      type: "user",
      id: userId,
      message: `${name} adlı kullanıcıyı tamamen silmek istediğinize emin misiniz? (Geçmiş siparişlerde 'Bilinmeyen Kullanıcı' olarak görünecektir)`
    });
  };

  const deleteUser = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${confirmModal.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== confirmModal.id));
        showToast("Kullanıcı silindi.");
      } else {
        showToast("Silme başarısız.", "error");
      }
    } catch (error) {
      showToast("Sunucu hatası.", "error");
    } finally {
      setConfirmModal({ isOpen: false, type: "", id: null, message: "" });
    }
  };


  // --- FOOD ACTIONS ---
  const handleFoodStatusToggle = async (foodId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "passive" : "active";
    try {
      const res = await fetch(`${API_URL}/allFoods/${foodId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setFoods(foods.map(f => f._id === foodId ? { ...f, status: newStatus } : f));
        showToast("Yemek durumu güncellendi.");
      } else {
        showToast("Güncelleme başarısız.", "error");
      }
    } catch (error) {
      showToast("Sunucu hatası.", "error");
    }
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/allFoods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(foodFormData)
      });
      if (res.ok) {
        const newFood = await res.json();
        setFoods([...foods, newFood]);
        setShowFoodForm(false);
        setFoodFormData({ name: "", price: 0, category: "mainCourse", image: "/assets/default-food.jpg" });
        showToast("Yemek oluşturuldu.");
      } else {
        const errorData = await res.json();
        showToast(errorData.message || "Oluşturma başarısız.", "error");
      }
    } catch (error) {
      showToast("Sunucu hatası.", "error");
    }
  };

  const handleEditFood = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/allFoods/${editingFood._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingFood)
      });
      if (res.ok) {
        const updatedFood = await res.json();
        setFoods(foods.map(f => f._id === updatedFood._id ? updatedFood : f));
        setEditingFood(null);
        showToast("Yemek başarıyla güncellendi.");
      } else {
        const errorData = await res.json();
        showToast(errorData.message || "Güncelleme başarısız.", "error");
      }
    } catch (error) {
      showToast("Sunucu hatası.", "error");
    }
  };

  const handleUpdateTier = async (tierId, newPrice) => {
    try {
      const res = await fetch(`${API_URL}/pricing-tiers/${tierId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packagePrice: Number(newPrice) })
      });
      if (res.ok) {
        const updatedTier = await res.json();
        setPricingTiers(pricingTiers.map(t => t._id === tierId ? updatedTier : t));
        showToast("Paket fiyatı güncellendi.");
      } else {
        showToast("Güncelleme başarısız.", "error");
      }
    } catch (error) {
      showToast("Sunucu hatası.", "error");
    }
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === "user") {
      deleteUser();
    } else if (confirmModal.type === "food") {
      deleteFood();
    }
  };

  const requestDeleteFood = (foodId, name) => {
    setConfirmModal({
      isOpen: true,
      type: "food",
      id: foodId,
      message: `"${name}" yemeğini kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`
    });
  };

  const deleteFood = async () => {
    try {
      const res = await fetch(`${API_URL}/allFoods/${confirmModal.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        setFoods(foods.filter(f => f._id !== confirmModal.id));
        showToast("Yemek silindi.");
      } else {
        showToast("Silme başarısız.", "error");
      }
    } catch (error) {
      showToast("Sunucu hatası.", "error");
    } finally {
      setConfirmModal({ isOpen: false, type: "", id: null, message: "" });
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen relative pt-10 pb-12 px-4 sm:px-6 md:px-12 xl:px-24 overflow-x-hidden">
      <ThemeToggle />

      {/* BAŞLIK VE GERİ BUTONU */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <Link href="/" className="group flex items-center gap-4 bg-white/70 dark:bg-[#111111]/80 backdrop-blur-xl px-6 py-4 rounded-[24px] border border-gray-200 dark:border-white/10 shadow-sm hover:border-transparent dark:hover:border-transparent hover:shadow-apple dark:hover:shadow-[0_0_20px_rgba(20,184,166,0.25)] transition-all overflow-hidden relative">
          <div className="absolute inset-y-0 right-0 w-0 bg-gradient-to-l from-primary-dark to-primary transition-all duration-500 ease-out group-hover:w-full z-0" />
          <div className="relative z-10 text-gray-800 dark:text-white transform group-hover:-translate-x-1 group-hover:text-white transition-all duration-300">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="relative z-10 font-rajdhani text-2xl font-bold text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300">Ana Ekrana Dön</span>
        </Link>

      </div>

      {/* HEADER & TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6 relative z-10">
        <div>
          <h2 className="font-bebas text-5xl text-gray-900 dark:text-white tracking-[0.1em] drop-shadow-md">
            ADMİN PANELİ
          </h2>
          <p className="font-rajdhani font-semibold text-lg text-primary mt-1 uppercase tracking-widest">
            Sistem Yönetimi
          </p>
        </div>

        <div className="flex bg-white/40 dark:bg-white/[0.05] p-1.5 rounded-2xl backdrop-blur-md border border-white/20 dark:border-white/10">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2.5 rounded-xl font-rajdhani font-bold text-lg transition-all ${activeTab === "users" ? "bg-primary text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-white/20"
              }`}
          >
            Kullanıcılar
          </button>
          <button
            onClick={() => setActiveTab("foods")}
            className={`px-6 py-2.5 rounded-xl font-rajdhani font-bold text-lg transition-all ${activeTab === "foods" ? "bg-primary text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-white/20"
              }`}
          >
            Yemekler
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`px-6 py-2.5 rounded-xl font-rajdhani font-bold text-lg transition-all ${activeTab === "pricing" ? "bg-primary text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-white/20"
              }`}
          >
            Fiyatlar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-white/30 dark:bg-white/[0.02] p-4 rounded-3xl border border-white/20 dark:border-white/10 backdrop-blur-md">
                <h2 className="font-rajdhani font-bold text-2xl text-gray-800 dark:text-gray-200 ml-4">
                  Kullanıcı Listesi
                </h2>
                <button
                  onClick={() => setShowUserForm(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-rajdhani font-bold text-lg uppercase tracking-wider transition-all shadow-apple hover:shadow-apple-hover active:scale-95"
                >
                  + Yeni Ekle
                </button>
              </div>

              {/* USER FORM MODAL */}
              <AnimatePresence>
                {showUserForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-3xl p-6 shadow-xl mb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-4 text-gray-800 dark:text-white">Yeni Kullanıcı Oluştur</h3>
                      <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text" placeholder="Ad" required
                          value={userFormData.firstName} onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                          className="w-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text" placeholder="Soyad"
                          value={userFormData.lastName} onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                          className="w-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                        <input
                          type="email" placeholder="E-posta" required
                          value={userFormData.email} onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                          className="w-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                        <select
                          value={userFormData.role} onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                          className="w-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        >
                          <option value="employee">Çalışan (Employee)</option>
                          <option value="admin">Yönetici (Admin)</option>
                          <option value="accountant">Muhasebe (Accountant)</option>
                        </select>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                          <button type="button" onClick={() => setShowUserForm(false)} className="px-6 py-3 rounded-2xl font-rajdhani font-bold text-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">İptal</button>
                          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-2xl font-rajdhani font-bold text-lg shadow-md hover:shadow-lg transition-all">Kaydet</button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* USERS LIST */}
              <div className="grid gap-4">
                {users.map(u => (
                  <div key={u._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-3xl shadow-sm hover:shadow-md transition-all gap-4">

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0">
                        <Image src={u.image || "/assets/avatar.jpg"} alt={u.firstName} fill sizes="56px" className="object-cover" />
                      </div>
                      <div>
                        <div className="font-rajdhani font-bold text-xl text-gray-900 dark:text-white">
                          {u.firstName} {u.lastName} {u._id === user._id && <span className="text-primary text-sm ml-2">(Sen)</span>}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{u.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <select
                        value={u.role}
                        onChange={(e) => handleUserRoleChange(u._id, e.target.value)}
                        disabled={u._id === user._id}
                        className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 font-rajdhani font-bold text-gray-700 dark:text-gray-300 focus:outline-none disabled:opacity-50"
                      >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                        <option value="accountant">Accountant</option>
                      </select>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUserStatusToggle(u._id, u.status)}
                          disabled={u._id === user._id}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors disabled:opacity-50 ${u.status === "active" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                          title={u.status === "active" ? "Aktif (Hesaba girebilir)" : "Pasif (Giriş yapamaz)"}
                        >
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${u.status === "active" ? "translate-x-6" : "translate-x-1"}`} />
                        </button>

                        <button
                          onClick={() => requestDeleteUser(u._id, u.firstName)}
                          disabled={u._id === user._id}
                          className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 dark:hover:text-white rounded-xl transition-all disabled:opacity-50"
                          title="Sil"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "foods" && (
            <motion.div
              key="foods"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-white/30 dark:bg-white/[0.02] p-4 rounded-3xl border border-white/20 dark:border-white/10 backdrop-blur-md">
                <h2 className="font-rajdhani font-bold text-2xl text-gray-800 dark:text-gray-200 ml-4">
                  Yemek Envanteri
                </h2>
                <button
                  onClick={() => setShowFoodForm(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-rajdhani font-bold text-lg uppercase tracking-wider transition-all shadow-apple hover:shadow-apple-hover active:scale-95"
                >
                  + Yeni Ekle
                </button>
              </div>

              {/* FOOD FORM MODAL */}
              <AnimatePresence>
                {showFoodForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-3xl p-6 shadow-xl mb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-4 text-gray-800 dark:text-white">Yeni Yemek Ekle</h3>
                      <form onSubmit={handleCreateFood} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input
                          type="text" placeholder="Yemek Adı (Örn: Mercimek Çorbası)" required
                          value={foodFormData.name} onChange={(e) => setFoodFormData({ ...foodFormData, name: e.target.value })}
                          className="w-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                        <div className="relative">
                          <input
                            type="number" placeholder="Fiyat" required min="0"
                            value={foodFormData.price} onChange={(e) => setFoodFormData({ ...foodFormData, price: e.target.value })}
                            className="w-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 pr-12 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">₺</span>
                        </div>
                        <select
                          value={foodFormData.category} onChange={(e) => setFoodFormData({ ...foodFormData, category: e.target.value })}
                          className="w-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        >
                          <option value="soup">Çorba</option>
                          <option value="mainCourse">Ana Yemek</option>
                          <option value="side">Yardımcı Yemek</option>
                          <option value="cold">Soğuklar</option>
                          <option value="dessert">Tatlı </option>
                          <option value="drink">İçecek</option>
                        </select>
                        <input
                          type="text" placeholder="Görsel URL (Opsiyonel)"
                          value={foodFormData.image} onChange={(e) => setFoodFormData({ ...foodFormData, image: e.target.value })}
                          className="w-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                        <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3 mt-2">
                          <button type="button" onClick={() => setShowFoodForm(false)} className="px-6 py-3 rounded-2xl font-rajdhani font-bold text-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">İptal</button>
                          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-2xl font-rajdhani font-bold text-lg shadow-md hover:shadow-lg transition-all">Kaydet</button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* EDIT FOOD MODAL */}
              <AnimatePresence>
                {editingFood && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="bg-primary/10 dark:bg-primary/5 border border-primary/30 rounded-3xl p-6 shadow-xl relative backdrop-blur-xl">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light to-primary-dark rounded-t-3xl" />
                      <h3 className="font-rajdhani font-bold text-xl mb-4 text-primary-dark dark:text-primary-light flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Yemek Düzenle
                      </h3>
                      <form onSubmit={handleEditFood} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input
                          type="text" placeholder="Yemek Adı" required
                          value={editingFood.name} onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                          className="w-full bg-white/50 dark:bg-black/50 border border-primary/20 rounded-2xl px-5 py-4 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                        <div className="relative">
                          <input
                            type="number" placeholder="Fiyat" required min="0"
                            value={editingFood.price} onChange={(e) => setEditingFood({ ...editingFood, price: e.target.value })}
                            className="w-full bg-white/50 dark:bg-black/50 border border-primary/20 rounded-2xl px-5 py-4 pr-12 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">₺</span>
                        </div>
                        <select
                          value={editingFood.category} onChange={(e) => setEditingFood({ ...editingFood, category: e.target.value })}
                          className="w-full bg-white/50 dark:bg-black/50 border border-primary/20 rounded-2xl px-5 py-4 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        >
                          <option value="soup">Çorba</option>
                          <option value="mainCourse">Ana Yemek</option>
                          <option value="side">Yardımcı Yemek</option>
                          <option value="cold">Soğuklar</option>
                          <option value="dessert">Tatlı / Meyve</option>
                          <option value="drink">İçecek</option>
                        </select>
                        <input
                          type="text" placeholder="Görsel URL (Opsiyonel)"
                          value={editingFood.image || ""} onChange={(e) => setEditingFood({ ...editingFood, image: e.target.value })}
                          className="w-full bg-white/50 dark:bg-black/50 border border-primary/20 rounded-2xl px-5 py-4 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                        <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3 mt-2">
                          <button type="button" onClick={() => setEditingFood(null)} className="px-6 py-3 rounded-2xl font-rajdhani font-bold text-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">İptal</button>
                          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-2xl font-rajdhani font-bold text-lg shadow-md hover:shadow-lg transition-all">Güncelle</button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FOOD SEARCH BAR VE BUGÜNÜN MENÜSÜ FİLTRESİ */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Yemek ara..."
                    value={foodSearchQuery}
                    onChange={(e) => setFoodSearchQuery(e.target.value)}
                    className="w-full bg-white/60 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3 font-rajdhani text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white shadow-sm transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowOnlyToday(!showOnlyToday)}
                  className={`px-6 py-3 rounded-2xl font-rajdhani font-bold text-lg transition-all flex items-center gap-2 ${showOnlyToday
                    ? "bg-primary text-white shadow-md border border-primary"
                    : "bg-white/60 dark:bg-black/40 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/5"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {showOnlyToday ? "Bugünün Menüsünü Filtrele" : "Bugünün Menüsünü Filtrele"}
                </button>
              </div>

              {/* FOODS LIST GROUPED BY CATEGORY */}
              <div className="space-y-8">
                {[
                  { key: "soup", title: "Çorbalar" },
                  { key: "mainCourse", title: "Ana Yemekler" },
                  { key: "side", title: "Yardımcı Yemekler" },
                  { key: "cold", title: "Soğuklar" },
                  { key: "drink", title: "İçecekler" },
                  { key: "dessert", title: "Tatlılar " }
                ].map(category => {
                  const categoryFoods = foods.filter(f => {
                    const matchSearch = f.name.toLowerCase().includes(foodSearchQuery.toLowerCase());
                    const matchToday = showOnlyToday ? todayMenuFoodIds.has(f._id) : true;
                    return matchSearch && matchToday && f.category === category.key;
                  });
                  if (categoryFoods.length === 0) return null;

                  return (
                    <div key={category.key} className="space-y-4">
                      <h4 className="font-bebas text-2xl text-gray-700 dark:text-gray-300 tracking-widest pl-3 border-l-4 border-primary">
                        {category.title}
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {categoryFoods.map(f => {
                          const isTodayMenu = todayMenuFoodIds.has(f._id);
                          return (
                            <div key={f._id} className={`flex items-center justify-between p-4 bg-white/60 dark:bg-black/40 backdrop-blur-xl border ${f.status === 'passive' ? 'border-red-500/30 dark:border-red-500/20 opacity-75 grayscale-[0.3]' : (isTodayMenu ? 'border-primary shadow-[0_0_15px_rgba(139,92,246,0.3)] dark:shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 'border-white/30 dark:border-white/10')} rounded-3xl shadow-sm transition-all gap-4`}>

                              <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-100 dark:border-white/10 bg-white/50 dark:bg-black/50">
                                  <Image src={f.image || "/assets/placeholder.png"} alt={f.name} fill sizes="56px" className="object-cover" />
                                </div>
                                <div>
                                  <div className="font-rajdhani font-bold text-xl text-gray-900 dark:text-white leading-tight">
                                    {f.name}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-primary-dark dark:text-primary-light font-bold text-sm bg-primary/5 dark:bg-primary/10 px-2 py-0.5 rounded-lg">
                                      {f.price} ₺
                                    </span>
                                    {f.status === "passive" && (
                                      <span className="text-red-500 text-xs font-bold bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-lg uppercase">
                                        Pasif
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {isTodayMenu && (
                                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold uppercase mr-1">
                                    Menüde
                                  </span>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingFood(f);
                                    if (showFoodForm) setShowFoodForm(false);
                                    window.scrollTo({ top: 300, behavior: "smooth" });
                                  }}
                                  className="p-2 bg-primary/5 text-primary-dark hover:bg-primary hover:text-white dark:bg-primary/10 dark:text-primary-light dark:hover:bg-primary dark:hover:text-white rounded-xl transition-all"
                                  title="Yemeği Düzenle"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>

                                <button
                                  onClick={() => handleFoodStatusToggle(f._id, f.status)}
                                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${f.status === "active" ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                                  title={f.status === "active" ? "Menüden Kaldır (Pasif Yap)" : "Menüye Ekle (Aktif Yap)"}
                                >
                                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${f.status === "active" ? "translate-x-6" : "translate-x-1"}`} />
                                </button>

                                <button
                                  onClick={() => requestDeleteFood(f._id, f.name)}
                                  className="p-2 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                  title="Yemeği Kalıcı Sil"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
          {activeTab === "pricing" && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/30 dark:bg-white/[0.02] p-6 rounded-3xl border border-white/20 dark:border-white/10 backdrop-blur-md">
                <h2 className="font-rajdhani font-bold text-2xl text-gray-800 dark:text-gray-200 mb-6">
                  Paket Fiyat Yönetimi
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {pricingTiers.map((tier) => (
                    <div key={tier._id} className="bg-white/60 dark:bg-black/40 p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-sm transition-all hover:shadow-md">
                      <div className="text-sm font-rajdhani font-bold text-primary uppercase tracking-wider mb-2">
                        {tier.itemCount} Çeşit Paket
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          defaultValue={tier.packagePrice}
                          onBlur={(e) => {
                            if (e.target.value !== String(tier.packagePrice)) {
                              handleUpdateTier(tier._id, e.target.value);
                            }
                          }}
                          className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 font-rajdhani font-bold text-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                        <span className="font-rajdhani font-bold text-xl text-gray-500">₺</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-3 font-medium">
                        Değişiklik yapınca kutu dışına tıklamanız yeterlidir.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-3xl border border-primary/20 flex items-start gap-4">
                <div className="bg-primary text-white p-2 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h4 className="font-rajdhani font-bold text-lg text-primary-dark dark:text-primary-light">Bilgilendirme</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    Burada belirlediğiniz fiyatlar, WhatsApp botu ve web sitesi üzerinden verilen siparişlerde otomatik olarak uygulanır. 
                    3 çeşitten az olan siparişlerde yemeklerin kendi birim fiyatları toplanır. 
                    İçecekler bu paketlere dahil edilmez, her zaman kendi fiyatları (30₺) üzerinden eklenir.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: "", id: null, message: "" })}
      />
    </div>
  );
}
