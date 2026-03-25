"use client";
import { useState } from "react";
import Link from "next/link"; 
import ProfileSelector from "@/components/ProfileSelector";
import MenuBoard from "@/components/MenuBoard";
import Toast from "./Toast";

// 1. TARİH MOTORU: Bileşenin dışında tanımlıyoruz ki her yerde güvenle çalışsın.
const getTodayFormatted = () => {
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const day = String(todayDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Home() {
  // 2. HAFIZA: Boş bırakmak yok! Direkt bugünün tarihiyle şak diye başlatıyoruz.
  const [selectedDate, setSelectedDate] = useState(getTodayFormatted());
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // 3. KAYIT MOTORU
  const handleSave = () => {
    if (!selectedProfile) {
      // ESKİ ALERT GİTTİ, YERİNE MODERN KIRMIZI TOAST GELDİ
      setToast({ show: true, message: "Lütfen menüleri kaydetmeden önce yukarıdan bir profil seçin!", type: "error" });
      return;
    }

    let allRecords = JSON.parse(localStorage.getItem('yemekKayitlari')) || {};
    
    if (!allRecords[selectedDate]) {
      allRecords[selectedDate] = [];
    }

    allRecords[selectedDate] = allRecords[selectedDate].filter(
      record => record.profil !== selectedProfile
    );

    allRecords[selectedDate].push({
      profil: selectedProfile,
      yemekler: selectedFoods
    });

    localStorage.setItem('yemekKayitlari', JSON.stringify(allRecords));
    
    // ESKİ ALERT GİTTİ, YERİNE MODERN SARI TOAST GELDİ
    setToast({ show: true, message: `Şahane! Seçimleriniz ${selectedProfile} profiline kaydedildi.`, type: "success" });

    window.scrollTo({ top: 0, behavior: "smooth" });

    setSelectedProfile(null);
    setSelectedFoods([]);
  };

  return (
    <>
      <div className="logo-container">
        <img src="/assets/svgexport-1.svg" alt="Kodpilot Logo" className="main-logo" />
        <span className="logo-subtitle">YEMEK</span>
      </div>

      <div className="tarih">
        <label htmlFor="tarih"></label>
        <p>Tarih</p>
        <input 
          type="date" 
          id="tarih" 
          min="2026-01-01" 
          max={getTodayFormatted()} 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)} 
        />
      </div>

      <ProfileSelector 
        selectedProfile={selectedProfile} 
        setSelectedProfile={setSelectedProfile} 
      />

      <MenuBoard 
        date={selectedDate} 
        selectedFoods={selectedFoods}
        setSelectedFoods={setSelectedFoods}
      />

      <div className="alt-navigasyon">
        <Link href="/history" className="harcamalar-btn">
          HARCAMALAR
        </Link>
      </div>
       
      <button 
        className={`onayla ${selectedFoods.length > 0 ? 'active' : ''}`} 
        onClick={handleSave}
      >
        Onayla
      </button>

      {/* MODERN TOAST BİLDİRİM EKRANI BURAYA EKLENDİ */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}
    </>
  );
}