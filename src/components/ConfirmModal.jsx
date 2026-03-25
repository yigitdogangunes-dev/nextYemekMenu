"use client";

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      zIndex: 99999, // En üstte çıksın diye yüksek verdik
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '30px',
        borderRadius: '12px',
        border: '2px solid #ffcc00',
        textAlign: 'center',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        animation: 'popIn 0.3s ease-out'
      }}>
        <h3 style={{ color: '#fff', marginBottom: '25px', fontFamily: 'var(--font-rajdhani)', fontSize: '22px' }}>
          {message}
        </h3>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={onCancel} 
            style={{ padding: '10px 20px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
          >
            İptal
          </button>
          <button 
            onClick={onConfirm} 
            style={{ padding: '10px 20px', backgroundColor: '#ff4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
          >
            Evet, Sil
          </button>
        </div>

        {/* Modalın ekrana zıplayarak gelme animasyonu */}
        <style>{`
          @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}