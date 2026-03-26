"use client"; // Next.js'te hata yakalayıcılar mecburen "client" tarafında çalışır
import { useEffect } from "react";

export default function Error({ error, reset }) {
  
  // Hata olduğunda arka planda konsola yazdırır ki sen ne olduğunu göresin
  useEffect(() => {
    console.error("Dükkanda kaza çıktı :", error);
  }, [error]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-color, #1e1e2f)', 
      color: '#fff', 
      textAlign: 'center', 
      padding: '20px' 
    }}>
      <h2 style={{ fontSize: '32px', color: '#ff4444', marginBottom: '15px' }}>
        Eyvah, Yangın Çıktı! 🔥
      </h2>
      
      <p style={{ fontSize: '18px', color: '#ccc', marginBottom: '25px', maxWidth: '500px' }}>
        Beklenmedik bir sorun oluştu . Veriler yüklenirken bir şeyler ters gitti ama hemen toparlıyoruz.
      </p>
      
      <button 
        // reset() fonksiyonu sayfayı F5 atmadan, bozulan yeri yeniden çalıştırmayı dener
        onClick={() => reset()} 
        style={{ 
          padding: '12px 24px', 
          fontSize: '18px', 
          backgroundColor: '#ffcc00', 
          color: '#111', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer', 
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
      >
        Motoru Yeniden Başlat 🔄
      </button>
    </div>
  );
}