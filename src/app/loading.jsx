export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', backgroundColor: '#111', color: '#ffcc00' 
    }}>
      {/* Kendi etrafında dönen şık bir yüklenme halkası */}
      <div style={{ 
        width: '60px', height: '60px', 
        border: '6px solid rgba(255, 204, 0, 0.2)', 
        borderTop: '6px solid #ffcc00', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite' 
      }}></div>
      
      <h2 style={{ 
        marginTop: '25px', fontFamily: 'var(--font-rajdhani)', 
        fontSize: '24px', letterSpacing: '1.5px', color: '#fff' 
      }}>
        Sayfa Hazırlanıyor...
      </h2>

      {/* Dönme efekti (spin) için gereken ufak CSS animasyonu */}
      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}