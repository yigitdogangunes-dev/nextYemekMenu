// Ortam değişkenini dosyanın en başında bir sabite alıyoruz
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Yeni siparişi alıp telsizle (HTTP POST) gerçek mutfağa gönderen motor
export const saveOrderToStorage = async (date, profile, foods) => {
  try {
    // 1. Önce mutfağa soralım: "Bugün bu profile ait eski bir sipariş var mı?"
    const checkResponse = await fetch(`${API_URL}/records?date=${date}&profile=${profile}`);
    const existingRecords = await checkResponse.json();

    // 2. Eğer varsa, o eski siparişi mutfaktan silelim (üstüne yazma mantığı)
    if (existingRecords.length > 0) {
      const oldRecordId = existingRecords[0].id;
      await fetch(`${API_URL}/records/${oldRecordId}`, {
        method: "DELETE"
      });
    }

    // 3. Şimdi yepyeni siparişimizi mutfağa (json-server) fırlatalım
    await fetch(`${API_URL}/records`, {
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
    console.error("Eyvah, mutfakla telsiz bağlantısı koptu !", error);
  }
};