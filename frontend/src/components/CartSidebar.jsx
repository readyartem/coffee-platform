import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          opacity: isCartOpen ? 1 : 0, pointerEvents: isCartOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease', zIndex: 10000
        }}
      />
      
      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px',
        background: '#fff', zIndex: 10001, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
        transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={24} color="var(--accent)" />
            Кошик
          </h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
            <X size={24} color="#1d1d1f" />
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cart.length === 0 ? (
            <div style={{ color: '#86868b', textAlign: 'center', marginTop: '50px' }}>Кошик порожній</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundImage: `url(${item.image_url || 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px', letterSpacing: '-0.01em' }}>{item.title}</div>
                    <div style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 600 }}>{item.price} ₴</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f5f5f7', padding: '6px', borderRadius: '8px' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ background: '#fff', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                    <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ background: '#fff', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: '#ff3b30' }}>
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ padding: '24px', borderTop: '1px solid rgba(0,0,0,0.05)', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
            <span>Разом:</span>
            <span>{total} ₴</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            style={{
              width: '100%', padding: '16px', background: cart.length === 0 ? '#ccc' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 600,
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer', transition: 'background 0.3s'
            }}
          >
            Оформити замовлення
          </button>
        </div>
      </div>
    </>
  );
}
