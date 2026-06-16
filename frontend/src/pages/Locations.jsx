import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import MapSection from '../components/MapSection';

export default function Locations() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <div style={{ paddingTop: '140px', minHeight: '100vh', paddingBottom: '100px', backgroundColor: 'var(--bg-color)' }}>
      <div ref={containerRef} className="container">
        
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '10px' }}>Наші Локації</h2>
          <p style={{ color: '#86868b', fontSize: '18px' }}>
            Завітайте до наших кав'ярень у Києві. Справжній смак преміальної кави та неповторна атмосфера чекають на вас.
          </p>
        </div>

        <MapSection />

        <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Атмосфера</h3>
            <p style={{ color: '#86868b', lineHeight: 1.6, fontSize: '15px' }}>
              Кожна наша локація — це простір, створений для вашого відпочинку. Мінімалістичний інтер'єр, приємна музика та аромат свіжозмеленої кави допомагають відволіктися від міської метушні.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Обладнання</h3>
            <p style={{ color: '#86868b', lineHeight: 1.6, fontSize: '15px' }}>
              Ми використовуємо лише найкращі еспресо-машини La Marzocco та кавомолки Mahlkönig, щоб кожна чашка кави відповідала найвищим стандартам якості.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Зерно</h3>
            <p style={{ color: '#86868b', lineHeight: 1.6, fontSize: '15px' }}>
              Співпрацюємо з провідними європейськими обсмажувальниками. У нас завжди є свіже зерно класу specialty для справжніх поціновувачів.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
