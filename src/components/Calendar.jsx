"use client";

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export default function Calendar({ currentDate, setCurrentDate, records, onDayClick }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const emptyBoxes = Array.from({ length: firstDay });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="ozel-takvim-kapsayici">
      <div className="takvim-ust-bilgi">
        <button id="onceki-ay" onClick={handlePrevMonth}>&#10094;</button> 
        <h2 id="ay-yil-baslik">{MONTHS[month]} {year}</h2>
        <button id="sonraki-ay" onClick={handleNextMonth}>&#10095;</button> 
      </div>

      <div className="takvim-gun-isimleri">
        <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div>Cmt</div><div>Paz</div>
      </div>

      <div className="takvim-izgara" id="takvim-gunleri">
        {emptyBoxes.map((_, index) => (
          <div key={`empty-${index}`} className="bos-kutu"></div>
        ))}

        {days.map((day) => {
          const formattedMonth = String(month + 1).padStart(2, '0');
          const formattedDay = String(day).padStart(2, '0');
          const fullDate = `${year}-${formattedMonth}-${formattedDay}`;

          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const midnightToday = new Date();
          midnightToday.setHours(0, 0, 0, 0);
          const cellDate = new Date(year, month, day);
          const isFuture = cellDate > midnightToday;

          const dayRecords = records[fullDate] || [];
          const orderProfiles = [...new Set(dayRecords.map(record => record.profil))];
          const hasOrders = orderProfiles.length > 0;

          return (
            <div 
              key={day} 
              className={`takvim-gunu ${isFuture ? 'gelecek-gun' : ''} ${isToday ? 'bugun' : ''}`}
              data-tarih={fullDate}
              onClick={() => onDayClick(fullDate, dayRecords)}
              // DİKKAT: Buradaki overflow: hidden ve style kısmını tamamen sildik, CSS'e devrettik.
            >
              <span className="gun-numarasi">{day}</span>
              
              {hasOrders && (
                <div className="gun-notu" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {orderProfiles.map((name, idx) => {
                    
                    const shortName = name.length > 10 ? name.substring(0, 10) + ".." : name;
                    
                    return (
                      <span 
                        key={idx} 
                        title={name} 
                        style={{ 
                          display: 'inline-block', 
                          whiteSpace: 'nowrap',
                          backgroundColor: 'rgba(255, 204, 0, 0.15)', // Şık bir sarı arka plan
                          color: '#ffcc00', // Sarı yazı
                          border: '1px solid rgba(255, 204, 0, 0.4)',
                          padding: '2px 6px', // Etiket gibi görünmesi için daraltıldı
                          borderRadius: '4px',
                          fontSize: '13px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }} 
                      >
                        👤 {shortName}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}