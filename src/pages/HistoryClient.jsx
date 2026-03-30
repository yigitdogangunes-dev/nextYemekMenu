"use client";
import { useState } from "react";
import Link from "next/link";
import Calendar from "@/components/Calendar";
// İŞTE YENİ MUHASEBECİMİZİ (HOOK) ÇAĞIRIYORUZ:
import { useRecords } from "@/hooks/useRecords";
import ConfirmModal from "@/components/ConfirmModal";
import Image from "next/image";

export default function HistoryClient() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // MODAL HAFIZALARI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ date: "", records: [] });
  // SİLME ONAY MODALI HAFIZASI
  const [confirmData, setConfirmData] = useState({ isOpen: false, date: null, index: null });

  // BÜYÜ BURADA: Bütün matematiği tek satırda Hook'tan çekiyoruz!
  const { 
    records, 
    deleteRecord, 
    monthlyTotals, 
    hasAnyRecordThisMonth, 
    grandTotal 
  } = useRecords(currentDate);

  // SADECE ARAYÜZ (Tıklama) İŞLEMLERİ BURADA KALDI
  const handleDayClick = (clickedDate, dayRecords) => {
    setModalData({ date: clickedDate, records: dayRecords });
    setIsModalOpen(true);
  };
  // 1. Çarpıya basınca Onay kutusunu açar
  const handleDeleteClick = (date, index) => {
    setConfirmData({ isOpen: true, date: date, index: index });
  };

  const executeDelete = async () => {
    const updatedDayRecords = await deleteRecord(confirmData.date, confirmData.index);
    
    // EĞER SİLME BAŞARILIYSA (false dönmediyse) listeyi güncelle
    if (updatedDayRecords !== false) {
      setModalData(prev => ({ ...prev, records: updatedDayRecords }));
    } else {
      alert("Silme işlemi başarısız oldu! Lütfen sayfayı yenileyip tekrar deneyin.");
    }
    
    setConfirmData({ isOpen: false, date: null, index: null }); // Onay kutusunu kapat
  };


  return (
    <>
      <div className="geridon">
        <div className="geridon__logo">
          <Link href="/">
            <Image src="/assets/arrow.png" alt="Geri Dön Logo" width={80} height={100} priority/>
          </Link>
        </div>
      </div>

      <Calendar 
        currentDate={currentDate} 
        setCurrentDate={setCurrentDate} 
        records={records} 
        onDayClick={handleDayClick} 
      />

      <a href="#profilToplamAlani" className="asagi-kaydir-btn">↓ TOPLAM HARCAMA</a>

      <div className="profilToplam" id="profilToplamAlani">
        {!hasAnyRecordThisMonth ? (
           <p style={{ textAlign: 'center', margin: '20px 0', fontSize: '20px' }}>Bu ay için henüz hiçbir harcama kaydı bulunmamaktadır.</p>
        ) : (
          <>
            {Object.entries(monthlyTotals).map(([profileName, totalAmount]) => (
              <div key={profileName} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', borderBottom: '1px solid #444' }}>
                <span style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>👤 {profileName}</span>
                <span style={{ fontSize: '20px', color: '#ffcc00' }}>{totalAmount}₺</span>
              </div>
            ))}

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '15px 15px', 
              marginTop: '15px',
              borderTop: '2px dashed #ffcc00', 
              backgroundColor: 'rgba(255, 204, 0, 0.05)',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}> GENEL TOPLAM</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{grandTotal}₺</span>
            </div>
          </>
        )}
      </div>

      {/* MODAL KISMI */}
      <div 
        className={`modal-arkaplan ${isModalOpen ? 'acik' : ''}`} 
        id="gunModali"
        onClick={() => setIsModalOpen(false)}
      >
        <div 
          className="modal-pencere"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-kapat" onClick={() => setIsModalOpen(false)}>&times;</button>
          
          <h3 className="modal-baslik" style={{ textAlign: 'center', marginBottom: '15px' }}>
            {modalData.date ? modalData.date.split('-').reverse().join('.') : ""}
          </h3>
          
          <div className="modal-icerik">
            {modalData.records.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '22px', color: '#ccc' }}>Bugüne ait bir seçim bulunmuyor.</p>
            ) : (
              modalData.records.map((record, index) => {
                const dailyTotal = record.yemekler.reduce((sum, food) => sum + Number(food.price), 0);

                return (
                  <div key={index} style={{ 
                    position: 'relative',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderLeft: '4px solid #ffcc00',
                    borderRadius: '8px', 
                    padding: '15px', 
                    marginBottom: '15px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                  }}>
                    
                    
                    <button 
                      onClick={() => handleDeleteClick(modalData.date, index)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '15px',
                        backgroundColor: '#ff4444',
                        border: 'none',
                        color: 'white',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '6px'
                      }}
                      title="Siparişi İptal Et"
                    >
                      ✖
                    </button>

                    <div style={{ fontWeight: '700', fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px', marginBottom: '15px', fontSize: '24px', color: '#ffcc00' }}>
                      👤 {record.profil}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                      {record.yemekler.map((food, foodIdx) => (
                        <div key={foodIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', color: '#ddd' }}>
                          <span>
                            - {food.name} 
                            {food.portion ? (
                              <span style={{ color: '#aaa', fontSize: '16px', marginLeft: '8px' }}>
                                ({food.portion} pors.)
                              </span>
                            ) : ''}
                          </span>
                          <span>{food.price}₺</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #555', paddingTop: '8px', color: '#4CAF50', fontSize: '22px', fontWeight: 'bold' }}>
                      Toplam: {dailyTotal}₺
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <ConfirmModal 
        isOpen={confirmData.isOpen}
        message="Bu siparişi silmek istediğinize emin misiniz?"
        onCancel={() => setConfirmData({ isOpen: false, date: null, index: null })}
        onConfirm={executeDelete}
      />
    </>
  );
}