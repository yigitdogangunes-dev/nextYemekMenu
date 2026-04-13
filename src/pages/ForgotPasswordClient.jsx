"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API } from "@/services/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.forgotPassword(email);
      setSuccess(response.message || "E-posta gönderildi! Lütfen gelen kutunuzu kontrol edin.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Arka Plan Süslemeleri */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-card/60 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl z-10 transition-all">
        
        <div className="text-center mb-8">
          <div className="relative w-[180px] h-[60px] mx-auto mb-2">
            <Image
              src="/assets/svgexport-1.svg"
              alt="Kodpilot Logo"
              fill
              className="object-contain dark:invert brightness-0 dark:brightness-100"
              priority
            />
          </div>
          <h2 className="text-2xl font-rajdhani font-bold text-foreground">Şifremi Unuttum</h2>
          <p className="text-muted-foreground font-rajdhani text-sm mt-2 px-4">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-rajdhani text-center animate-pulse">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm font-rajdhani text-center">
            {success}
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-rajdhani font-medium ml-1">E-posta Adresi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="örnek@kodpilot.com"
                className="w-full bg-background/50 border border-input text-foreground rounded-xl px-4 py-3 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-rajdhani"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-bold text-lg py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-50 font-rajdhani"
            >
              {isLoading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        ) : (
          <div className="text-center">
             <Link href="/login" className="inline-block bg-primary text-primary-foreground font-rajdhani font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all">
                Giriş Sayfasına Dön
             </Link>
          </div>
        )}

        <div className="mt-8 text-center border-t border-border/50 pt-6">
          <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors font-rajdhani text-sm flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Giriş sayfasına geri dön
          </Link>
        </div>

      </div>
    </div>
  );
}
