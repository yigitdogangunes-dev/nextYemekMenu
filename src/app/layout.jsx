import { Bebas_Neue, Rajdhani, Fugaz_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
  icons:{
    icon: "/icon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning prevents mismatch errors caused by next-themes injecting classes on load
    <html lang="tr" suppressHydrationWarning className={`${bebas.variable} ${rajdhani.variable} ${fugaz.variable}`} data-scroll-behavior="smooth">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}