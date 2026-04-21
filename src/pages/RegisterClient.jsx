"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API } from "@/services/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterClient() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.register(formData);
      setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err) {
      setError(err.message || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Arka Plan Süslemeleri */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Register Kartı */}
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
          <h2 className="text-2xl font-rajdhani font-bold text-foreground">Yeni Hesap Oluştur</h2>
          <p className="text-muted-foreground font-rajdhani text-sm mt-1">Sisteme dahil olmak için formu doldurun</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-rajdhani font-medium ml-1">Ad</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Örn: Yiğit"
                className="w-full bg-background/50 border border-input text-foreground rounded-xl px-4 py-2.5 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-rajdhani"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-rajdhani font-medium ml-1">Soyad</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doğan"
                className="w-full bg-background/50 border border-input text-foreground rounded-xl px-4 py-2.5 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-rajdhani"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-rajdhani font-medium ml-1">E-posta</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="örnek@kodpilot.com"
              className="w-full bg-background/50 border border-input text-foreground rounded-xl px-4 py-2.5 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-rajdhani"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-bold text-lg py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 font-rajdhani mt-4"
          >
            {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border/50 pt-6">
          <p className="text-muted-foreground font-rajdhani text-sm">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-primary font-bold hover:text-secondary transition-colors">
              Giriş Yap
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
