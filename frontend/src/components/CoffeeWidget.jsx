import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Coffee, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CoffeeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [menu, setMenu] = useState([]);
  const [resultId, setResultId] = useState(null);
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/menu')
      .then(res => setMenu(res.data))
      .catch(err => {
         // Fallback matching server.js seed data
         setMenu([
          { id: 1, title: 'Еспресо Black Onyx', price: 55, image_url: '/coffee/espresso.jpg', description: 'Подвійний шот преміальної кави темного обсмаження.' },
          { id: 2, title: 'Оксамитовий Лате', price: 75, image_url: '/coffee/latte.jpg', description: 'Шовковисте збите молоко з ноткою ванілі.' },
          { id: 3, title: 'Золота Матча', price: 90, image_url: '/coffee/matcha.jpg', description: 'Церемоніальна матча з вівсяним молоком.' },
          { id: 4, title: 'Капучино', price: 65, image_url: '/coffee/cappuccino.jpg', description: 'Ідеальний баланс кави та ніжної пінки.' },
          { id: 5, title: 'Флет Вайт', price: 70, image_url: '/coffee/flat_white.jpg', description: 'Подвійний еспресо з гарячим молоком.' },
          { id: 6, title: 'Тірамісу Нуар', price: 110, image_url: '/coffee/tiramisu.jpg', description: 'Класичний італійський десерт з нашим фірмовим еспресо.' },
          { id: 7, title: 'Шоколадний Брауні', price: 85, image_url: '/coffee/brownie.jpg', description: 'Насичений шоколадний десерт.' },
          { id: 8, title: 'Масляний Круасан', price: 65, image_url: '/coffee/croissant.jpg', description: 'Класичний французький круасан з маслом.' }
         ]);
      });
  }, []);

  const handleAnswer = (answer) => {
    if (step === 0) setStep(1);
    else if (step === 1) {
      if (answer === 'black') setResultId(1); // Еспресо
      if (answer === 'milk') setStep(3);
      if (answer === 'other') setStep(4);
    }
    else if (step === 3) {
      if (answer === 'flat') setResultId(5);
      if (answer === 'cap') setResultId(4);
      if (answer === 'latte') setResultId(2);
    }
    else if (step === 4) {
      if (answer === 'matcha') setResultId(3);
      if (answer === 'tiramisu') setResultId(6);
      if (answer === 'brownie') setResultId(7);
      if (answer === 'croissant') setResultId(8);
    }
  };

  const reset = () => {
    setStep(0);
    setResultId(null);
  };

  const recommendedItem = resultId ? menu.find(m => m.id === resultId) || menu[0] : null;

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
      
      {isOpen && (
        <div className="glass-panel" style={{ width: '320px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ background: '#000', color: '#fff', padding: '20px', position: 'relative' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Підбір кави</h3>
            <p style={{ margin: '5px 0 0', fontSize: '13px', opacity: 0.8 }}>Ми знайдемо ваш ідеальний смак</p>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            {resultId && recommendedItem ? (
              <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>Ідеально для вас:</h4>
                <div style={{ width: '100%', height: '140px', borderRadius: '12px', backgroundImage: `url(${recommendedItem.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '15px' }}></div>
                <h5 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 5px' }}>{recommendedItem.title}</h5>
                <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 15px' }}>{recommendedItem.description}</p>
                
                <button 
                  onClick={() => {
                    addToCart(recommendedItem);
                    setIsOpen(false);
                    toast.success(`${recommendedItem.title} додано в кошик!`, { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
                  }}
                  style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', marginBottom: '10px' }}
                >
                  Додати за {recommendedItem.price} ₴
                </button>
                <button onClick={reset} style={{ width: '100%', padding: '10px', background: 'transparent', color: '#86868b', border: 'none', fontSize: '13px', cursor: 'pointer' }}>
                  Пройти тест ще раз
                </button>
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                {step === 0 && (
                  <>
                    <p style={{ fontSize: '15px', lineHeight: 1.5, marginBottom: '20px' }}>Не знаєте, що обрати? Дайте відповідь на кілька питань, і ми порадимо ідеальний напій!</p>
                    <button onClick={() => handleAnswer()} style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      Підібрати каву
                    </button>
                  </>
                )}
                {step === 1 && (
                  <>
                    <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Якій основі ви віддаєте перевагу?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button onClick={() => handleAnswer('black')} style={{ padding: '12px', background: '#f5f5f7', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'left', fontWeight: 500, cursor: 'pointer' }}>Чорна кава</button>
                      <button onClick={() => handleAnswer('milk')} style={{ padding: '12px', background: '#f5f5f7', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'left', fontWeight: 500, cursor: 'pointer' }}>З молоком</button>
                      <button onClick={() => handleAnswer('other')} style={{ padding: '12px', background: '#f5f5f7', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'left', fontWeight: 500, cursor: 'pointer' }}>Щось інше / Десерт</button>
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Який баланс кави та молока вам до вподоби?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button onClick={() => handleAnswer('flat')} style={{ padding: '12px', background: '#f5f5f7', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'left', fontWeight: 500, cursor: 'pointer' }}>Більше кави</button>
                      <button onClick={() => handleAnswer('cap')} style={{ padding: '12px', background: '#f5f5f7', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'left', fontWeight: 500, cursor: 'pointer' }}>Більше пінки</button>
                      <button onClick={() => handleAnswer('latte')} style={{ padding: '12px', background: '#f5f5f7', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'left', fontWeight: 500, cursor: 'pointer' }}>М'який та солодкуватий</button>
                    </div>
                  </>
                )}
                {step === 4 && (
                  <>
                    <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Що саме ви шукаєте?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button onClick={() => handleAnswer('matcha')} style={{ padding: '12px', background: '#f5f5f7', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'left', fontWeight: 500, cursor: 'pointer' }}>Тонізуючий напій</button>
                      <button onClick={() => handleAnswer('tiramisu')} style={{ padding: '12px', background: '#f5f5f7', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'left', fontWeight: 500, cursor: 'pointer' }}>Кавовий десерт</button>
                      <button onClick={() => handleAnswer('brownie')} style={{ padding: '12px', background: '#f5f5f7', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'left', fontWeight: 500, cursor: 'pointer' }}>Шоколадний десерт</button>
                      <button onClick={() => handleAnswer('croissant')} style={{ padding: '12px', background: '#f5f5f7', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'left', fontWeight: 500, cursor: 'pointer' }}>Свіжа випічка</button>
                    </div>
                  </>
                )}
                {step > 0 && (
                  <button onClick={reset} style={{ marginTop: '15px', padding: '0', background: 'transparent', color: '#86868b', border: 'none', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <X size={14} /> Почати спочатку
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <button 
        onClick={() => { setIsOpen(!isOpen); if(!isOpen) reset(); }}
        style={{
          width: '60px', height: '60px', borderRadius: '50%', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', transition: 'transform 0.3s'
        }}
        onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'}
        onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
      >
        {isOpen ? <X size={28} /> : <Coffee size={28} />}
      </button>
      
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
