import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ChevronRight, Coffee, MapPin } from 'lucide-react';
import MapSection from '../components/MapSection';

export default function Home() {
  const videoRef = useRef(null);

  useEffect(() => {
    // No entrance animations
  }, []);

  return (
    <div style={{ paddingBottom: '100px', background: 'var(--bg-color)' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        minHeight: '90vh', 
        display: 'flex', 
        alignItems: 'center', 
        paddingTop: '160px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 600, color: '#86868b', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}></span>
            Нова локація у центрі Києва
          </div>
          
          <h1 className="display-title fade-up" style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '20px' }}>
            Кава, якою вона <br />має бути.
          </h1>
          
          <p className="fade-up" style={{ fontSize: '21px', lineHeight: 1.4, color: '#86868b', fontWeight: 500, maxWidth: '600px', marginBottom: '40px' }}>
            Мінімалізм у деталях, бездоганність у смаку. Сервіс онлайн-замовлень преміум класу для вашого ідеального ранку.
          </p>
          
          <div className="fade-up" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/menu" className="btn" style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '14px 30px', fontSize: '15px' }}>
              Зробити замовлення
            </Link>
            <Link to="/locations" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px', color: '#000000', fontWeight: 500, transition: 'opacity 0.3s', textDecoration: 'none' }}>
              Наші заклади <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ width: '100%', maxWidth: '1000px', aspectRatio: '16/9', borderRadius: '8px', marginTop: '60px', overflow: 'hidden', position: 'relative' }}>
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              playsInline 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onTimeUpdate={(e) => {
                if (e.target.duration && e.target.currentTime >= e.target.duration - 0.5) {
                  e.target.currentTime = 0;
                  e.target.play();
                }
              }}
            >
              <source src="/coffee/latte_video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US BLOCK */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div className="fade-up">
              <h2 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '24px' }}>Менше шуму.<br/>Більше смаку.</h2>
              <p style={{ color: '#86868b', fontSize: '19px', lineHeight: 1.6, marginBottom: '20px', fontWeight: 500 }}>
                Ми відмовилися від зайвого. Залишили тільки ретельно відібрані зерна, ідеальне обсмаження та сучасний підхід до сервісу.
              </p>
              <div style={{ display: 'flex', gap: '30px', marginTop: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Coffee color="var(--accent)" size={28} />
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>Спешелті кава</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <MapPin color="var(--accent)" size={28} />
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>Зручні локації</span>
                </div>
              </div>
            </div>
            <div className="fade-up" style={{ height: '500px', background: 'url("/coffee/second.jpg") center/cover', borderRadius: '8px' }}>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED MENU BLOCK */}
      <section style={{ padding: '80px 0', background: '#f5f5f7' }}>
        <div className="container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Популярне</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {[
              { id: 1, title: 'Black Onyx Espresso', price: 55, desc: 'Подвійний шот темного обсмаження.', img: '/coffee/espresso.jpg' },
              { id: 2, title: 'Velvet Latte', price: 75, desc: 'Шовковисте молоко з ваніллю.', img: '/coffee/latte.jpg' },
              { id: 3, title: 'Golden Matcha', price: 90, desc: 'Матча з вівсяним молоком.', img: '/coffee/matcha.jpg' }
            ].map((item, idx) => (
              <div key={item.id} className="glass-panel fade-up" style={{ padding: '0', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '220px', backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.01em' }}>{item.title}</h3>
                  <p style={{ fontSize: '15px', color: '#86868b', flex: 1, marginBottom: '30px' }}>{item.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 600 }}>{item.price} ₴</span>
                    <Link to="/menu" className="btn" style={{ padding: '6px 16px', fontSize: '13px', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '4px' }}>Замовити</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="fade-up" style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/menu" style={{ fontSize: '15px', color: '#000000', fontWeight: 500, textDecoration: 'none' }}>Переглянути все меню <ChevronRight size={14} style={{display: 'inline', verticalAlign: 'middle'}}/></Link>
          </div>
        </div>
      </section>

      {/* 4. MAP BLOCK */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Наші Локації</h2>
            <p style={{ color: '#86868b', fontSize: '18px', maxWidth: '600px', margin: '16px auto 0' }}>Ми завжди поруч, щоб подарувати вам хвилини справжньої насолоди.</p>
          </div>
          <MapSection />
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/locations" style={{ fontSize: '15px', color: '#000000', fontWeight: 500, textDecoration: 'none' }}>Більше про локації <ChevronRight size={14} style={{display: 'inline', verticalAlign: 'middle'}}/></Link>
          </div>
        </div>
      </section>

      {/* 5. CTA / FOOTER BLOCK */}
      <section style={{ padding: '60px 0 60px 0' }}>
        <div className="container">
          <div className="fade-up" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>Готові до ідеальної кави?</h2>
            <p style={{ color: '#86868b', fontSize: '19px', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px auto' }}>Зареєструйтесь зараз та отримайте 100 бонусів на перше замовлення.</p>
            <Link to="/auth" className="btn" style={{ background: '#1d1d1f', color: '#fff', border: 'none', padding: '14px 30px', fontSize: '15px' }}>
              Створити акаунт
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
