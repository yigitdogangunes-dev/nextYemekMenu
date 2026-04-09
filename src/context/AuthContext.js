"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Sayfa yenilendiğinde sunucuya sor: "Bu cookie'nin sahibi kim?"
    // localStorage okumuyoruz, tamamen cookie'ye güveniyoruz.
    const checkSession = async () => {
      try {
        const data = await API.me();
        setUser(data.user);
      } catch {
        // Cookie yoksa veya süresi bitmişse, kullanıcı null kalır — sorun değil
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Giriş Yapma (Login) İşlemi
  // Cookie sunucu tarafından otomatik set edildi, biz sadece kullanıcıyı state'e alıyoruz
  const login = (userData) => {
    setUser(userData);
    router.push("/");
  };

  // Çıkış Yapma (Logout) İşlemi
  // Sunucuya istekte bulunarak cookie'yi sunucu tarafından imha ettiriyoruz
  const logout = async () => {
    await API.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
