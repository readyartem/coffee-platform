import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import gsap from 'gsap';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    // Fetch menu from backend
    api.get('/api/menu')
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        // Fallback mock data if backend is down
        setItems([
          { id: 1, title: 'Еспресо Black Onyx', price: 55, category_name: 'Кава', description: 'Подвійний шот преміальної кави темного обсмаження.', image_url: '/coffee/espresso.jpg' },
          { id: 2, title: 'Оксамитовий Лате', price: 75, category_name: 'Кава', description: 'Шовковисте збите молоко з ноткою ванілі.', image_url: '/coffee/latte.jpg' },
          { id: 3, title: 'Золота Матча', price: 90, category_name: 'Кава', description: 'Церемоніальна матча з вівсяним молоком.', image_url: '/coffee/matcha.jpg' },
          { id: 4, title: 'Капучино', price: 65, category_name: 'Кава', description: 'Ідеальний баланс кави та ніжної пінки.', image_url: '/coffee/cappuccino.jpg' },
          { id: 5, title: 'Флет Вайт', price: 70, category_name: 'Кава', description: 'Подвійний еспресо з гарячим молоком.', image_url: '/coffee/flat_white.jpg' },
          { id: 6, title: 'Тірамісу Нуар', price: 110, category_name: 'Десерти', description: 'Класичний італійський десерт з нашим фірмовим еспресо.', image_url: '/coffee/tiramisu.jpg' }
        ]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    toast((t) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
        <span><strong>{item.title}</strong> у кошику!</span>
        <button 
          onClick={() => { setIsCartOpen(true); toast.dismiss(t.id); }} 
          style={{ background: '#fff', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
        >
          Перейти
        </button>
      </div>
    ), {
      duration: 4000,
      style: { borderRadius: '12px', background: '#222', color: '#fff', padding: '12px 16px', maxWidth: 'none' }
    });
  };

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px', background: 'var(--bg-color)' }}>
      <div className="container">
        <h2 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '10px' }}>Меню</h2>
        <p style={{ color: '#86868b', marginBottom: '50px', fontSize: '18px', width: '100%', lineHeight: 1.5 }}>
          Обирайте найкраще з нашого асортименту. Ми ретельно відібрали кожен сорт та інгредієнт, щоб ви могли насолоджуватися бездоганним смаком кави кожного дня.
        </p>

        {loading ? (
          <div style={{ color: '#86868b' }}>Завантаження...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {items.map(item => (
              <div key={item.id} className="glass-panel menu-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '220px', backgroundImage: `url(${item.image_url || 'https://images.unsplash.com/photo-1551529834-525807d6b4f3?w=500&q=80'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000', marginBottom: '15px' }}>
                    {item.category_name}
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '15px', color: '#86868b', flex: 1, marginBottom: '30px', lineHeight: 1.4 }}>{item.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '20px', fontWeight: 600 }}>{item.price} ₴</span>
                        <span style={{ fontSize: '13px', color: '#86868b', fontWeight: 500 }}>або {item.price * 10} бонусів</span>
                    </div>
                    <button className="btn" style={{ padding: '8px 20px', fontSize: '13px', background: '#000000', color: '#ffffff', borderRadius: '4px', border: 'none' }} onClick={() => handleAddToCart(item)}>В кошик</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
