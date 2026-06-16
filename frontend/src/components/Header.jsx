import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useCart } from '../context/CartContext';

export default function Header() {
  const headerRef = useRef(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { cart, setIsCartOpen } = useCart();
  const cartItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') setIsAdmin(true);
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    gsap.fromTo(headerRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

  return (
    <>
    <header 
      ref={headerRef} 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 9999,
        padding: '16px 0',
        background: 'rgba(251, 251, 253, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 9.56H6M18 9.56L16.5 23.06H8.25L6 9.56M18 9.56C18 7.9687 17.3679 6.44258 16.2426 5.31736C15.1174 4.19214 13.5913 3.56 12 3.56C10.4087 3.56 8.88258 4.19214 7.75736 5.31736C6.63214 6.44258 6 7.9687 6 9.56M3.75 9.56H20.25" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.276 15.56L13.905 2.115C13.9496 1.91557 14.0345 1.72735 14.1544 1.5619C14.2743 1.39644 14.4268 1.25724 14.6025 1.15283C14.7782 1.04842 14.9733 0.981006 15.176 0.954726C15.3786 0.928445 15.5845 0.943852 15.781 1L19.5 2.06M7 15.56H17.333" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px', letterSpacing: '-0.03em' }}>Кав'ярня №1</Link>
      </div>

      <nav className="desktop-nav" style={{
        display: 'flex', gap: '32px',
        fontSize: '15px', fontWeight: 600
      }}>
        <Link to="/" className="nav-link" style={{ transition: 'color 0.3s' }}>Головна</Link>
        <Link to="/about" className="nav-link" style={{ transition: 'color 0.3s' }}>Про нас</Link>
        <Link to="/menu" className="nav-link" style={{ transition: 'color 0.3s' }}>Меню</Link>
        <Link to="/locations" className="nav-link" style={{ transition: 'color 0.3s' }}>Локації</Link>
        {isAdmin && <Link to="/dashboard" className="nav-link" style={{ transition: 'color 0.3s' }}>Адмін-панель</Link>}
      </nav>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div className="desktop-nav" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div 
            onClick={() => setIsCartOpen(true)}
            style={{ position: 'relative', padding: '10px', display: 'flex', cursor: 'pointer', transition: 'color 0.3s' }}
          >
            <ShoppingBag size={20} color="var(--text-main)" />
            {cartItemsCount > 0 && (
              <div style={{
                position: 'absolute', top: '2px', right: '0px', background: 'var(--accent)',
                color: '#fff', fontSize: '10px', fontWeight: 700, width: '18px', height: '18px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {cartItemsCount}
              </div>
            )}
          </div>
          <Link to="/profile">
            <div style={{
              padding: '10px', display: 'flex', cursor: 'pointer', transition: 'color 0.3s'
            }}>
              <User size={20} color="var(--text-main)" />
            </div>
          </Link>
        </div>
        
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} color="var(--text-main)" />
        </button>
      </div>
      </div>

    </header>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%',
        background: 'rgba(255, 255, 255, 0.98)', zIndex: 10000,
        display: 'flex', flexDirection: 'column',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        transform: isMobileMenuOpen ? 'translateY(0%)' : 'translateY(-100%)',
        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <div style={{ padding: '16px 4vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 9.56H6M18 9.56L16.5 23.06H8.25L6 9.56M18 9.56C18 7.9687 17.3679 6.44258 16.2426 5.31736C15.1174 4.19214 13.5913 3.56 12 3.56C10.4087 3.56 8.88258 4.19214 7.75736 5.31736C6.63214 6.44258 6 7.9687 6 9.56M3.75 9.56H20.25" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.276 15.56L13.905 2.115C13.9496 1.91557 14.0345 1.72735 14.1544 1.5619C14.2743 1.39644 14.4268 1.25724 14.6025 1.15283C14.7782 1.04842 14.9733 0.981006 15.176 0.954726C15.3786 0.928445 15.5845 0.943852 15.781 1L19.5 2.06M7 15.56H17.333" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px', letterSpacing: '-0.03em' }}>Кав'ярня №1</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={24} color="var(--text-main)" />
          </button>
        </div>
        <nav style={{ padding: '60px 4vw', display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '32px', fontWeight: 700, alignItems: 'center' }}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{
            opacity: isMobileMenuOpen ? 1 : 0, transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s', textDecoration: 'none', color: '#000'
          }}>Головна</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={{
            opacity: isMobileMenuOpen ? 1 : 0, transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.12s', textDecoration: 'none', color: '#000'
          }}>Про нас</Link>
          <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} style={{
            opacity: isMobileMenuOpen ? 1 : 0, transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.15s', textDecoration: 'none', color: '#000'
          }}>Меню</Link>
          <Link to="/locations" onClick={() => setIsMobileMenuOpen(false)} style={{
            opacity: isMobileMenuOpen ? 1 : 0, transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s', textDecoration: 'none', color: '#000'
          }}>Локації</Link>
          <div 
            onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              opacity: isMobileMenuOpen ? 1 : 0, transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.25s', color: '#000'
            }}
          >
            Кошик {cartItemsCount > 0 && <span style={{fontSize:'16px', background:'var(--accent)', color:'#fff', padding:'2px 10px', borderRadius:'12px', verticalAlign: 'middle'}}>{cartItemsCount}</span>}
          </div>
          <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{
            opacity: isMobileMenuOpen ? 1 : 0, transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s', textDecoration: 'none', color: '#000'
          }}>Профіль</Link>
          {isAdmin && <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{
            opacity: isMobileMenuOpen ? 1 : 0, transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.35s', textDecoration: 'none', color: '#000'
          }}>Адмін-панель</Link>}
        </nav>
      </div>
    </>
  );
}
