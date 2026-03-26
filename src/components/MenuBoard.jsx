"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { yemekVeritabani } from "@/constants/food-db"; 
import { rastgeleSec } from "@/utils/choose-random";

export default function MenuBoard({ date, selectedFoods, setSelectedFoods }) {
  const [dailyMenu, setDailyMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) return;

    const fetchOrCreateMenu = async () => {
      setLoading(true);
      try {
        // 1. JSON Server'da bu tarihte menü var mı kontrol et
        const response = await fetch(`http://localhost:4000/menus?date=${date}`);
        const existingMenus = await response.json();

        if (existingMenus.length > 0) {
          // Menü zaten varsa, onu kullan
          setDailyMenu(existingMenus[0]);
        } else {
          // Menü yoksa, yeni oluştur ve sunucuya kaydet
          const newMenu = {
            date: date,
            corba: rastgeleSec(yemekVeritabani.corba, 2),
            anaYemek: rastgeleSec(yemekVeritabani.anaYemek, 3),
            eslikci: rastgeleSec(yemekVeritabani.eslikci, 2),
            soguk: rastgeleSec(yemekVeritabani.soguk, 2),
            tatli: rastgeleSec(yemekVeritabani.tatli, 2)
          };

          // JSON Server'a kaydet
          const postResponse = await fetch("http://localhost:4000/menus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMenu)
          });
          
          const savedMenu = await postResponse.json();
          setDailyMenu(savedMenu);
        }
      } catch (error) {
        console.error("Menü yüklenirken hata:", error);
        // Hata durumunda fallback: server'a bağlanamazsa, local'de oluştur
        const fallbackMenu = {
          date: date,
          corba: rastgeleSec(yemekVeritabani.corba, 2),
          anaYemek: rastgeleSec(yemekVeritabani.anaYemek, 3),
          eslikci: rastgeleSec(yemekVeritabani.eslikci, 2),
          soguk: rastgeleSec(yemekVeritabani.soguk, 2),
          tatli: rastgeleSec(yemekVeritabani.tatli, 2)
        };
        setDailyMenu(fallbackMenu);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateMenu();
  }, [date]);

  // YEMEĞE TIKLAMA MOTORU (Varsayılan olarak 1 Porsiyon ekler)
  const handleFoodClick = (food, categoryTitle) => {
    const otherFoods = selectedFoods.filter(item => item.category !== categoryTitle);
    const isAlreadySelected = selectedFoods.find(item => item.name === food.isim);

    if (isAlreadySelected) {
      setSelectedFoods(otherFoods);
    } else {
      // Yemeği ilk seçtiğinde hafızaya porsiyonunu (1) ve baz fiyatını da atıyoruz
      setSelectedFoods([...otherFoods, { 
        name: food.isim, 
        basePrice: food.fiyat, // Çarpma işlemi için orijinal fiyatı saklıyoruz
        price: food.fiyat,     // Kasaya gidecek olan güncel fiyat
        portion: 1, 
        category: categoryTitle 
      }]);
    }
  };

  // PORSİYON DEĞİŞTİRME MOTORU
  const handlePortionChange = (e, food, newPortion, categoryTitle) => {
    e.stopPropagation(); // Kartın iptal olmasını engeller (sadece butona basılmış sayar)

    // Seçili yemeği bul ve güncelle
    const updatedFoods = selectedFoods.map(item => {
      if (item.name === food.isim) {
        return {
          ...item,
          portion: newPortion,
          price: item.basePrice * newPortion // Orijinal fiyatı yeni porsiyonla çarp!
        };
      }
      return item;
    });

    setSelectedFoods(updatedFoods);
  };

  if (!dailyMenu || loading) {
    return <div className="container" id="dinamik-menu-alani"></div>;
  }

  const renderCategory = (title, items, className) => (
    <div className="kategori-bolumu">
      <h2>{title}</h2>
      <div className="list">
        {items.map((y, index) => {
          // Bu yemek şu an seçili mi? Seçiliyse hafızadan bilgilerini çek
          const selectedItem = selectedFoods.find(item => item.name === y.isim);
          const isSelected = !!selectedItem;
          
          // Ekranda görünecek fiyat ve porsiyon (Seçiliyse çarpılmış fiyatı, değilse normal fiyatı göster)
          const displayPrice = isSelected ? selectedItem.price : y.fiyat;
          const currentPortion = isSelected ? selectedItem.portion : 1;

          return (
            <div 
              key={index} 
              className={`${className} ${isSelected ? 'secili-yemek' : ''}`} 
              onClick={() => handleFoodClick(y, title)}
              // Kartı flex-start yaparak içindeki butonların taşmasını engelliyoruz
              style={{ justifyContent: 'flex-start' }} 
            >
              <Image 
                src={y.image} 
                alt={y.isim} 
                width={250} 
                height={250} 
                // Senin CSS'indeki object-fit ve border-radius ayarlarının bozulmaması için
                style={{ objectFit: 'cover', borderRadius: '7px' }} 
                />
              
              {/* İsmi ve Fiyatı kapsayan alan */}
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p>{y.isim}</p>
                <p className="ucret">{displayPrice}₺</p>
              </div>

              {/* İŞTE YENİ PORSİYON BUTONLARI: Sadece yemek seçiliyse ekranda belirir */}
              {isSelected && (
                <div 
                  className="porsiyon-kontrol" 
                  style={{ display: 'flex', gap: '8px', marginTop: '10px', zIndex: 10 }}
                >
                  {[0.5, 1, 1.5, 2].map(p => (
                    <button
                      key={p}
                      onClick={(e) => handlePortionChange(e, y, p, title)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: currentPortion === p ? '#ffcc00' : 'rgba(20, 20, 20, 0.8)',
                        color: currentPortion === p ? '#000' : '#fff',
                        border: `2px solid ${currentPortion === p ? '#ffcc00' : '#555'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="container" id="dinamik-menu-alani">
      {renderCategory("ÇORBA", dailyMenu.corba, "corba")}
      {renderCategory("ANA YEMEK", dailyMenu.anaYemek, "yemek")}
      {renderCategory("EŞLİKÇİ", dailyMenu.eslikci, "yemek")}
      {renderCategory("SOĞUK", dailyMenu.soguk, "soguk")}
      {renderCategory("TATLI", dailyMenu.tatli, "tatlı")}
    </div>
  );
}