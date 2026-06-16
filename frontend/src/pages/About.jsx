import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function About() {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(heroRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .fromTo(textRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.6")
      .fromTo(statsRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, "-=0.6");
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', paddingBottom: '120px' }}>
      
      {/* Hero Header */}
      <div style={{ paddingTop: '180px', paddingBottom: '80px' }} className="container">
        <div ref={heroRef} style={{ maxWidth: '900px' }}>
          <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '32px' }}>
            Мистецтво<br/>у кожній чашці.
          </h1>
          <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', color: '#86868b', fontWeight: 500, lineHeight: 1.4, maxWidth: '700px' }}>
            Ми не просто варимо каву. Ми створюємо моменти, які хочеться зупинити. Бездоганний смак, преміальний сервіс та естетика в кожній деталі.
          </p>
        </div>
      </div>

      {/* Massive Image Block */}
      <div className="container" style={{ marginBottom: '120px' }}>
        <div style={{ width: '100%', aspectRatio: '21/9', borderRadius: '24px', backgroundImage: 'url("/coffee/hero.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
        </div>
      </div>

      {/* Philosophy Split Section */}
      <div className="container" ref={textRef} style={{ marginBottom: '120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '24px', lineHeight: 1.1 }}>
              Філософія без компромісів.
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#86868b', lineHeight: 1.6, marginBottom: '20px' }}>
              Кав'ярня №1 була створена з єдиною метою — перетворити щоденний ритуал споживання кави на справжній естетичний досвід. Від ретельно підібраного освітлення до ідеальної текстури пінки на вашому капучино — ми контролюємо все.
            </p>
            <p style={{ fontSize: '1.15rem', color: '#86868b', lineHeight: 1.6 }}>
              Наші бариста — це справжні майстри своєї справи, які щоденно калібрують смак, щоб кожна крапля розкривала свій потенціал на 100%. Наша місія: надавати найвищий рівень сервісу кожному гостю.
            </p>
          </div>
          <div style={{ height: '500px', borderRadius: '24px', backgroundImage: 'url("/coffee/third.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container">
        <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '80px 0' }}>
          <div>
            <div style={{ fontSize: '5rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#000', lineHeight: 1 }}>3</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#86868b', marginTop: '12px' }}>Атмосферні локації у Києві</div>
          </div>
          <div>
            <div style={{ fontSize: '5rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#000', lineHeight: 1 }}>100<span style={{ fontSize: '3rem' }}>%</span></div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#86868b', marginTop: '12px' }}>Зерно класу Specialty</div>
          </div>
          <div>
            <div style={{ fontSize: '5rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#000', lineHeight: 1 }}>24<span style={{ fontSize: '3rem' }}>/</span>7</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#86868b', marginTop: '12px' }}>Прагнення до ідеалу</div>
          </div>
        </div>
      </div>

      {/* Manifesto Section */}
      <div className="container" style={{ marginTop: '120px', textAlign: 'center', maxWidth: '800px' }}>
         <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            "Тільки бездоганність."
         </h2>
         <p style={{ marginTop: '20px', color: '#86868b', fontSize: '1.2rem', fontWeight: 500 }}>— Команда Кав'ярні №1</p>
      </div>

    </div>
  );
}
