"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API } from "@/services/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function VerifyLoginClient({ token }) {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("Giriş yapılıyor, lütfen bekleyin...");
  const router = useRouter();
  const { login } = useAuth();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    const verifyToken = async () => {
      try {
        const response = await API.verifyLogin(token);
        
        setStatus("success");
        setMessage("Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...");
        login(response.user);
        
        setTimeout(() => {
          router.push("/");
        }, 500);
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Bağlantının süresi dolmuş veya geçersiz.");
      }
    };

    verifyToken();
  }, [token, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-card/60 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl z-10 transition-all text-center">
        
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-xl font-rajdhani font-bold text-foreground">{message}</h2>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-rajdhani font-bold text-green-500">{message}</h2>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-rajdhani font-bold text-red-500 mb-6">{message}</h2>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-lg font-rajdhani"
            >
              Giriş Ekranına Dön
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
