import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#f5f5f7', paddingTop: '100px', paddingBottom: '40px', borderTop: '1px solid rgba(0,0,0,0.05)', marginTop: 'auto' }}>
      <div className="container">
        
        {/* Top Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '60px', marginBottom: '80px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 9.56H6M18 9.56L16.5 23.06H8.25L6 9.56M18 9.56C18 7.9687 17.3679 6.44258 16.2426 5.31736C15.1174 4.19214 13.5913 3.56 12 3.56C10.4087 3.56 8.88258 4.19214 7.75736 5.31736C6.63214 6.44258 6 7.9687 6 9.56M3.75 9.56H20.25" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.276 15.56L13.905 2.115C13.9496 1.91557 14.0345 1.72735 14.1544 1.5619C14.2743 1.39644 14.4268 1.25724 14.6025 1.15283C14.7782 1.04842 14.9733 0.981006 15.176 0.954726C15.3786 0.928445 15.5845 0.943852 15.781 1L19.5 2.06M7 15.56H17.333" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', letterSpacing: '-0.03em', color: '#000' }}>Кав'ярня №1</span>
            </div>
            <p style={{ color: '#86868b', fontSize: '15px', lineHeight: 1.6, maxWidth: '280px' }}>
              Мінімалізм у деталях, бездоганність у смаку. Сервіс преміум класу для вашого ідеального ранку.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#000' }}>Навігація</h4>
            <Link to="/" style={{ color: '#86868b', fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#000'} onMouseOut={e => e.target.style.color = '#86868b'}>Головна</Link>
            <Link to="/about" style={{ color: '#86868b', fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#000'} onMouseOut={e => e.target.style.color = '#86868b'}>Про нас</Link>
            <Link to="/menu" style={{ color: '#86868b', fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#000'} onMouseOut={e => e.target.style.color = '#86868b'}>Меню</Link>
            <Link to="/locations" style={{ color: '#86868b', fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#000'} onMouseOut={e => e.target.style.color = '#86868b'}>Локації</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#000' }}>Слідкуйте за нами</h4>
            <a href="#" style={{ color: '#86868b', fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#000'} onMouseOut={e => e.target.style.color = '#86868b'}>Instagram</a>
            <a href="#" style={{ color: '#86868b', fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#000'} onMouseOut={e => e.target.style.color = '#86868b'}>Telegram</a>
          </div>
        </div>

        {/* Big Text Brand */}
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '40px', marginBottom: '40px' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 12rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: '#e5e5e7', margin: 0, whiteSpace: 'nowrap', textAlign: 'center' }}>
              КАВ'ЯРНЯ №1
            </h1>
        </div>

        {/* Bottom Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <span style={{ color: '#86868b', fontSize: '14px', fontWeight: 500 }}>© 2026 Кав'ярня №1. Всі права захищені.</span>
          <div style={{ display: 'flex', gap: '30px', fontSize: '14px', color: '#86868b', fontWeight: 500 }}>
            <Link to="/" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }} onMouseOver={e => e.target.style.color = '#000'} onMouseOut={e => e.target.style.color = '#86868b'}>Політика конфіденційності</Link>
            <Link to="/" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }} onMouseOver={e => e.target.style.color = '#000'} onMouseOut={e => e.target.style.color = '#86868b'}>Умови використання</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
