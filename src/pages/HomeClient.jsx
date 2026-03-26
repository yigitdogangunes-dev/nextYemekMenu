"use client";
import { useState } from "react";
import Link from "next/link"; 
import ProfileSelector from "@/components/ProfileSelector";
import MenuBoard from "@/components/MenuBoard";
import Toast from "@/components/Toast";
import { getTodayFormatted } from "@/utils/date";
import { saveOrderToStorage } from "@/utils/storage";

export default function Home() {
  // 2. HAFIZA: Boş bırakmak yok! Direkt bugünün tarihiyle şak diye başlatıyoruz.
  const [selectedDate, setSelectedDate] = useState(getTodayFormatted());
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // 3. KAYIT MOTORU (Artık sadece UI/Arayüz işlerini yapıyor)
  const handleSave = () => {
    if (!selectedProfile) {
      setToast({ show: true, message: "Lütfen seçimleri kaydetmeden önce yukarıdan bir profil seçin!", type: "error" });
      return;
    }

    // İŞTE BÜYÜ BURADA: Bütün o çirkin hesap kitap işini Utils'e postaladık!
    saveOrderToStorage(selectedDate, selectedProfile, selectedFoods);
    
    // Aşağısı sadece Garsonun yapması gereken görsel işler:
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