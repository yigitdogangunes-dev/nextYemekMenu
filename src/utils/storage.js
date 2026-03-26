// // Yeni siparişi alıp veritabanına (tarayıcı hafızasına) kaydeden motor
// export const saveOrderToStorage = (date, profile, foods) => {
//   let allRecords = JSON.parse(localStorage.getItem('yemekKayitlari')) || {};
    
//   if (!allRecords[date]) {
//     allRecords[date] = [];
//   }

//   // O gün o profil için daha önce girilmiş kayıt varsa, önce onu temizle
//   allRecords[date] = allRecords[date].filter(
//     record => record.profil !== profile
//   );

//   // Yepyeni siparişi listeye ekle
//   allRecords[date].push({
//     profil: profile,
//     yemekler: foods
//   });

//   // Güncel listeyi tekrar hafızaya yaz
//   localStorage.setItem('yemekKayitlari', JSON.stringify(allRecords));
// };



// src/utils/storage.js

// Yeni siparişi alıp telsizle (HTTP POST) gerçek mutfağa gönderen motor
export const saveOrderToStorage = async (date, profile, foods) => {
  try {
    // 1. Önce mutfağa soralım: "Bugün bu profile ait eski bir sipariş var mı?"
    const checkResponse = await fetch(`http://localhost:4000/records?date=${date}&profile=${profile}`);
    const existingRecords = await checkResponse.json();

    // 2. Eğer varsa, o eski siparişi mutfaktan silelim (üstüne yazma mantığı)
    if (existingRecords.length > 0) {
      const oldRecordId = existingRecords[0].id;
      await fetch(`http://localhost:4000/records/${oldRecordId}`, {
        method: "DELETE"
      });
    }

    // 3. Şimdi yepyeni siparişimizi mutfağa (json-server) fırlatalım
    await fetch("http://localhost:4000/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Veritabanına gidecek olan Jilet gibi veri yapımız
      body: JSON.stringify({
        date: date,
        profile: profile,
        foods: foods
      }),
    });

  } catch (error) {
    console.error("Eyvah, mutfakla telsiz bağlantısı koptu patron!", error);
  }
};