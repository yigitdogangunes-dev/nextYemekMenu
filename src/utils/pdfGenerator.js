import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateExpenseReport = async (recordsObj, monthlyTotals, currentDate) => {
  // currentDate objesinden ay bilgisini çıkar
  const currentMonthNum = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const currentMonthName = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(currentDate);

  // 1. Dökümanı Başlat (A4, Dikey, birim: pt)
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // jsPDF standart fontlarında Türkçe karakterleri işlemek için yardımcı fonksiyon
  const tr = (text) => {
    if (!text) return "";
    return text.toString()
      .normalize("NFC")
      .replace(/ğ/g, "g").replace(/Ğ/g, "G")
      .replace(/ş/g, "s").replace(/Ş/g, "S")
      .replace(/ı/g, "i").replace(/İ/g, "I")
      .replace(/ç/g, "c").replace(/Ç/g, "C")
      .replace(/ö/g, "o").replace(/Ö/g, "O")
      .replace(/ü/g, "u").replace(/Ü/g, "U");
  };

  // --- BAŞLIK BÖLÜMÜ ---
  // Kenar süsü dikey çizgi
  doc.setFillColor(20, 184, 166); // Turkuaz vurgu rengi
  doc.rect(40, 40, 5, 40, "F");

  // HTML Canvas numarasıyla logoyu yükle (SVG import sorunlarını çözer)
  try {
    const base64Data = await new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = window.document.createElement("canvas");
        // Ölçekleyerek yüksek kalite render al (Retina/Print ready)
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        const ctx = canvas.getContext("2d");
        // Logoyu beyazdan siyaha veya belirgin koyu renge dönüştür (PDF beyaz arka planlı)
        ctx.filter = "invert(1) brightness(0)";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error("Logo yüklenemedi"));
      img.src = "/assets/svgexport-1.svg"; // Kesin çalışan logo dosyamız
    });
    
    // Resmi ekle: X, Y, W, H
    doc.addImage(base64Data, "PNG", 52, 43, 110, 32); 
  } catch (error) {
    // Logo dosyası eksikse zarif bir metin yedeği göster
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // Koyu gri (Slate-800)
    doc.text("KODPILOT YEMEK", 55, 60);
  }

  // Alt Başlık (Ay & Yıl)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184); // Açık gri (Slate-400)
  doc.text(tr(`Aylik Harcama Dokumu | ${currentMonthName} ${currentYear}`), 55, 95);

  // Yazdırılma Tarihi
  const today = new Date().toLocaleDateString("tr-TR");
  doc.setFontSize(9);
  doc.text(tr(`Cikti Tarihi: ${today}`), pageWidth - 40, 95, { align: "right" });
  
  // Ayırıcı Çizgi
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(40, 110, pageWidth - 40, 110);

  // --- ÖZET KUTUSU (Dinamik Izgara) ---
  const profiles = Object.keys(monthlyTotals || {});
  const maxPerRow = 3;
  const profileRows = Math.max(1, Math.ceil(profiles.length / maxPerRow));
  const rowHeight = 20;

  // Layout çapaları - her şey boxTop'a bağlıdır
  const boxTop = 130;
  const titleY = boxTop + 20;                              // "Aylık Profil Özetleri"
  const firstProfileY = titleY + 22;                       // İlk profil satırı
  const lastProfileY = firstProfileY + (profileRows - 1) * rowHeight;
  const separatorY = lastProfileY + 14;                    // İnce çizgi
  const totalTextY = separatorY + 16;                      // "Genel Toplam"
  const boxBottom = totalTextY + 12;                       // Kutu alt kenarı
  const boxHeight = boxBottom - boxTop;

  // Kutu çiz
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, boxTop, pageWidth - 80, boxHeight, 8, 8, "FD");

  // Başlık
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(tr("Aylik Profil Ozetleri"), 55, titleY);

  // Profil isimleri
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(11);

  let grandTotal = 0;
  const colWidth = (pageWidth - 120) / maxPerRow;

  profiles.forEach((profile, idx) => {
    const row = Math.floor(idx / maxPerRow);
    const col = idx % maxPerRow;
    const x = 55 + col * colWidth;
    const y = firstProfileY + row * rowHeight;

    const capitalizedProfile = profile.charAt(0).toUpperCase() + profile.slice(1);
    const total = monthlyTotals[profile] || 0;
    doc.text(`${tr(capitalizedProfile)}: ${total} TL`, x, y);
    grandTotal += total;
  });

  if (profiles.length === 0) {
    doc.text(tr("Gosterilecek profil verisi yok."), 55, firstProfileY);
  }

  // Ayırıcı çizgi
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(55, separatorY, pageWidth - 55, separatorY);

  // Genel Toplam
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.text(`Genel Toplam: ${grandTotal} TL`, pageWidth - 55, totalTextY, { align: "right" });

  // --- VERİ TABLOSU BÖLÜMÜ (ZAMAN ÇİZELGESİ) ---
  const tableStartY = boxBottom + 25; // Tabloyu kutunun 25pt altından başlat
  const tableRows = [];

  // Mevcut ay/yıl ile eşleşen anahtarları filtrele ve artan sırada sırala
  const monthDates = Object.keys(recordsObj || {}).filter(dateString => {
    const parts = dateString.split("-");
    if (parts.length < 3) return false;
    return parseInt(parts[0], 10) === currentYear && parseInt(parts[1], 10) === currentMonthNum;
  }).sort((a, b) => new Date(a) - new Date(b));

  monthDates.forEach(dateStr => {
    const dObj = new Date(dateStr);
    const formattedDate = dObj.toLocaleDateString("tr-TR", { day: '2-digit', month: '2-digit', year: 'numeric' });
    const items = recordsObj[dateStr] || [];
    
    items.forEach(record => {
      const pName = record.profile;
      const capitalizedProfile = pName ? pName.charAt(0).toUpperCase() + pName.slice(1) : "Bilinmiyor";
      const itemsArray = record.items || [];
      
      const summaryText = itemsArray.map(f => f.name).join(", ");
      const total = itemsArray.reduce((sum, f) => sum + Number(f.price), 0);
      
      if (total > 0 || itemsArray.length > 0) {
        tableRows.push([formattedDate, tr(capitalizedProfile), tr(summaryText), `${total} TL`]);
      }
    });
  });

  if (tableRows.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.text(tr("Bu ay hic harcama verisi bulunamadi."), 40, tableStartY);
  } else {
    autoTable(doc, {
      startY: tableStartY,
      head: [["Tarih", "Profil", "Siparis Detayi", "Tutar"]],
      body: tableRows,
      theme: "plain",
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 8,
        lineColor: [226, 232, 240], // Açık gri çizgi rengi
        lineWidth: { bottom: 0.5 },
        textColor: [51, 65, 85]
      },
      columnStyles: {
        0: { cellWidth: 70 }, 
        1: { cellWidth: 60, fontStyle: 'bold' }, 
        2: { cellWidth: 'auto' }, 
        3: { cellWidth: 70, halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] } 
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250] 
      }
    });
  }

  // --- ALT BİLGİ ---
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 30 : 250;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(tr("Bu dokum Kodpilot Yemek Sistemi tarafindan otomatik olarak olusturulmustur."), pageWidth / 2, finalY, { align: "center" });

  // 6. PDF'i Kaydet
  const filename = tr(`Kodpilot_${currentMonthName}_${currentYear}.pdf`).replace(/\s+/g, "_");
  doc.save(filename);
};
