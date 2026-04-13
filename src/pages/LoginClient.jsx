"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { API } from "@/services/api";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await API.login({ email, password });
      login(response.user);
    } catch (err) {
      setError(err.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden transition-colors duration-300">
      
      {/* TEMA DEĞİŞTİR BUTONU GİRİŞ SAYFASINDA */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Arka Plan Süslemeleri (Temaya Uygun) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Login Kartı */}
      <div className="relative w-full max-w-md bg-card/60 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl z-10 transition-all">
        
        {/* LOGO */}
        <div className="text-center mb-10">
          <div className="relative w-[180px] h-[60px] md:w-[220px] md:h-[75px] mx-auto mb-2">
            <Image
              src="/assets/svgexport-1.svg"
              alt="Kodpilot Logo"
              fill
              className="object-contain drop-shadow-sm opacity-90 dark:drop-shadow-[0_0_35px_rgba(255,204,0,0.6)] dark:filter-none dark:invert brightness-0 dark:brightness-100 transition-all duration-700"
              priority
            />
          </div>
          <p className="text-muted-foreground font-rajdhani mt-2 text-lg">Sipariş Yönetim Sistemi</p>
        </div>

        {/* HATA MESAJI */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-rajdhani text-center animate-pulse">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-foreground text-sm font-rajdhani font-medium ml-1">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="örnek@kodpilot.com"
              className="w-full bg-background/50 border border-input text-foreground rounded-xl px-4 py-3 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-rajdhani"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-foreground text-sm font-rajdhani font-medium">Şifre</label>
              <Link href="/forgot-password" title="Şifremi Unuttum" className="text-xs text-primary hover:text-secondary transition-colors font-rajdhani">
                Şifremi Unuttum?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-background/50 border border-input text-foreground rounded-xl px-4 py-3 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-rajdhani"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-bold text-lg py-3.5 rounded-xl transition-all shadow-[0_0_20px_var(--primary-half)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden font-rajdhani"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Giriş Yapılıyor...
              </span>
            ) : (
              <span className="flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                Sisteme Giriş Yap
              </span>
            )}
          </button>
        </form>

        {/* REGISTER LINK */}
        <div className="mt-8 text-center border-t border-border/50 pt-6">
          <p className="text-muted-foreground font-rajdhani text-sm">
            Hesabınız yok mu?{" "}
            <Link href="/register" title="Yeni Kayıt Oluştur" className="text-primary font-bold hover:text-secondary transition-colors">
              Hemen Kayıt Ol
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
