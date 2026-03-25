import { Bebas_Neue, Rajdhani, Fugaz_One } from "next/font/google";
import "./globals.css";

// Fontları indirip değişkene atıyoruz
const bebas = Bebas_Neue({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-bebas" 
});

const rajdhani = Rajdhani({ 
  weight: ["300", "400", "500", "600", "700"], 
  subsets: ["latin"], 
  variable: "--font-rajdhani" 
});

const fugaz = Fugaz_One({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-fugaz" 
});

export const metadata = {
  title: "Yemek Sipariş Sistemi",
  description: "Günlük yemek ve porsiyon seçim ekranı",
};

export default function RootLayout({ children }) {
  return (
    // Font değişkenlerini tüm HTML'e enjekte ediyoruz
    <html lang="tr" className={`${bebas.variable} ${rajdhani.variable} ${fugaz.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}