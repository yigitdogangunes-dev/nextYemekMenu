"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { API } from "@/services/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function ResetPasswordClient({ token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Şifreler birbiriyle eşleşmiyor.");
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.resetPassword(token, password);
      setSuccess("Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err) {
      setError(err.message || "Bağlantı geçersiz veya süresi dolmuş olabilir.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-card/60 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl z-10 transition-all">

        <div className="text-center mb-10">
          <div className="relative w-[180px] h-[60px] mx-auto mb-2">
            <Image
              src="/assets/svgexport-1.svg"
              alt="Kodpilot Logo"
              fill
              className="object-contain dark:invert brightness-0 dark:brightness-100"
              priority
            />
          </div>
          <h2 className="text-2xl font-rajdhani font-bold text-foreground font-rajdhani">Yeni Şifre Belirle</h2>
          <p className="text-muted-foreground font-rajdhani text-sm mt-2">
            Lütfen kendiniz için güvenli ve yeni bir şifre girin.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-foreground text-sm font-rajdhani font-medium ml-1">Yeni Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-background/50 border border-input text-foreground rounded-xl px-4 py-3 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-rajdhani"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-rajdhani font-medium ml-1">Yeni Şifre (Yeniden)</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••"
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
            {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </form>

      </div>
    </div>
  );
}
