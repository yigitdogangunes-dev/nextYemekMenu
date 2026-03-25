import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', backgroundColor: '#111', color: '#fff', textAlign: 'center', padding: '20px' 
    }}>
      <h1 style={{ fontSize: '100px', color: '#ff4444', fontFamily: 'var(--font-fugaz)', margin: '0' }}>
        404
      </h1>
      <h2 style={{ fontSize: '36px', fontFamily: 'var(--font-rajdhani)', color: '#ffcc00', marginBottom: '20px' }}>
        Dükkan Kapalı!
      </h2>
      <p style={{ fontSize: '20px',fontFamily: 'var(--font-rajdhani)',fontWeight:"bold" , color: '#aaa', marginBottom: '40px', maxWidth: '450px' }}>
        Aradığınız sayfayı bulamadık.
      </p>
      
      <Link href="/" style={{ 
        padding: '12px 30px', backgroundColor: '#ffcc00', color: '#000', 
        textDecoration: 'none', fontSize: '22px', fontWeight: 'bold', 
        borderRadius: '8px', fontFamily: 'var(--font-rajdhani)', 
        boxShadow: '0 4px 15px rgba(255, 204, 0, 0.4)'
      }}>
        🏠 Ana Menüye Dön
      </Link>
    </div>
  );
}