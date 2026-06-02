"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import MonthPicker from "@/components/MonthPicker";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const PIE_COLORS = ['#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#10b981', '#6366f1'];

export default function DashboardClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [analyticsMonth, setAnalyticsMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  // Güvenlik duvarı: sadece admin ve accountant girebilir
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && user.role !== "admin" && user.role !== "accountant") {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "accountant")) {
      fetchAnalytics();
    }
  }, [analyticsMonth, user]);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`${API_URL}/records/analytics?month=${analyticsMonth}`, {
        credentials: "include"
      });
      if (res.ok) {
        setAnalyticsData(await res.json());
      }
    } catch (error) {
      console.error("Analitik verisi alınamadı:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (user.role !== "admin" && user.role !== "accountant") return null;

  return (
    <div className="min-h-screen relative pt-10 pb-12 px-4 sm:px-6 md:px-12 xl:px-24 overflow-x-hidden">
      <ThemeToggle />

      {/* Arka Plan Süslemeleri */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-background transition-colors duration-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-background to-[#e5e5ea] dark:hidden"></div>
        <div className="hidden dark:block absolute inset-0 bg-[#0c1421] z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full blur-[180px]" style={{ background: 'rgba(20, 184, 166, 0.12)' }} />
          <div className="absolute bottom-[-15%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[200px]" style={{ background: 'rgba(13, 148, 136, 0.06)' }} />
        </div>
      </div>

      <div className="relative z-10">
        {/* Geri butonu */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="group flex items-center gap-4 bg-white/70 dark:bg-[#111111]/80 backdrop-blur-xl px-6 py-4 rounded-[24px] border border-gray-200 dark:border-white/10 shadow-sm hover:border-transparent dark:hover:border-transparent hover:shadow-apple dark:hover:shadow-[0_0_20px_rgba(20,184,166,0.25)] transition-all overflow-hidden relative"
          >
            <div className="absolute inset-y-0 right-0 w-0 bg-gradient-to-l from-primary-dark to-primary transition-all duration-500 ease-out group-hover:w-full z-0" />
            <div className="relative z-10 text-gray-800 dark:text-white transform group-hover:-translate-x-1 group-hover:text-white transition-all duration-300">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="relative z-10 font-rajdhani text-2xl font-bold text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300">Ana Ekrana Dön</span>
          </Link>
        </div>

        {/* Başlık */}
        <div className="mb-8">
          <h2 className="font-bebas text-5xl text-gray-900 dark:text-white tracking-[0.1em] drop-shadow-md">
            FİNANSAL DASHBOARD
          </h2>
          <p className="font-rajdhani font-semibold text-lg text-primary mt-1 uppercase tracking-widest">
            {user.role === "accountant" ? "Muhasebe Görünümü" : "Yönetici Görünümü"}
          </p>
        </div>

        {/* Ay Seçici */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/30 dark:bg-white/[0.02] p-6 rounded-3xl border border-white/20 dark:border-white/10 backdrop-blur-md gap-4 mb-8">
          <h2 className="font-rajdhani font-bold text-2xl text-gray-800 dark:text-gray-200">
            Harcama Analizi & Grafikler
          </h2>
          <div className="flex items-center">
            <MonthPicker value={analyticsMonth} onChange={setAnalyticsMonth} />
          </div>
        </div>

        {analyticsLoading || !analyticsData ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Toplam Maliyet", value: `${analyticsData.totalCost} ₺`, color: "text-gray-800 dark:text-white" },
                { label: "Ortalama Sipariş Tutarı", value: `${analyticsData.avgOrderCost} ₺`, color: "text-primary" },
                { label: "Toplam Porsiyon/Sipariş", value: analyticsData.totalOrders, color: "text-gray-800 dark:text-white" },
                { label: "Aktif Kişi Sayısı", value: analyticsData.activeUsersCount, color: "text-green-500" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white/60 dark:bg-black/40 p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-sm flex flex-col gap-2">
                  <span className="text-sm font-rajdhani font-bold text-gray-500 uppercase">{kpi.label}</span>
                  <span className={`text-3xl font-bebas tracking-wider ${kpi.color}`}>{kpi.value}</span>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/60 dark:bg-black/40 p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-sm">
                <h3 className="font-rajdhani font-bold text-xl text-gray-700 dark:text-gray-300 mb-6">Harcama Trendi (Günlük)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.spendingTrend}>
                    <defs>
                      <linearGradient id="colorTotalDash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                    <XAxis dataKey="date" stroke="#8884d8" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#8884d8" fontSize={12} tickFormatter={(v) => `₺${v}`} />
                    <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', color: '#374151' }} />
                    <Area type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotalDash)" name="Tutar" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/60 dark:bg-black/40 p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-sm">
                <h3 className="font-rajdhani font-bold text-xl text-gray-700 dark:text-gray-300 mb-6">En Çok Tercih Edilen Yemekler</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.topFoods} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                    <XAxis type="number" stroke="#8884d8" />
                    <YAxis dataKey="name" type="category" width={100} stroke="#8884d8" fontSize={11} />
                    <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', color: '#374151' }} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={24} name="Porsiyon" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/60 dark:bg-black/40 p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-sm">
                <h3 className="font-rajdhani font-bold text-xl text-gray-700 dark:text-gray-300 mb-6">Kişi Bazlı Harcama Dağılımı</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={analyticsData.userSpending.slice(0, 10)}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="total"
                      nameKey="name"
                    >
                      {analyticsData.userSpending.slice(0, 10).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `₺${value}`} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', color: '#374151' }} />
                    <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Kişi bazlı harcama tablosu */}
              <div className="bg-white/60 dark:bg-black/40 p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-sm">
                <h3 className="font-rajdhani font-bold text-xl text-gray-700 dark:text-gray-300 mb-6">Kişi Bazlı Harcama Listesi</h3>
                <div className="overflow-y-auto max-h-[330px] space-y-3 pr-1">
                  {analyticsData.userSpending.map((u, idx) => (
                    <div key={u.name} className="flex items-center justify-between p-3 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                        />
                        <span className="font-rajdhani font-bold text-gray-700 dark:text-gray-200">{u.name}</span>
                      </div>
                      <span className="font-bebas text-xl text-primary tracking-wider">{u.total} ₺</span>
                    </div>
                  ))}
                  {analyticsData.userSpending.length === 0 && (
                    <p className="text-center text-gray-400 font-rajdhani italic pt-4">Bu ay için harcama verisi yok.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
