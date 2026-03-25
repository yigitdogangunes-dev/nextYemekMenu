export function rastgeleSec(dizi, adet) {
    const kopya = [...dizi]; 
    console.log("deger:", kopya);
    
    kopya.sort(() => 0.5 - Math.random());
    return kopya.slice(0, adet);
  }