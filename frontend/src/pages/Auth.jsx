import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await api.post('/api/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', data.token);
        toast.success('Успішний вхід!', {
          style: { borderRadius: '12px', background: '#333', color: '#fff' }
        });
        window.location.href = '/profile';
      } else {
        await api.post('/api/auth/register', formData);
        toast.success('Успішна реєстрація! Тепер увійдіть.', {
          style: { borderRadius: '12px', background: '#333', color: '#fff' }
        });
        setIsLogin(true);
      }
    } catch (e) {
      toast.error('Помилка: ' + (e.response?.data?.error || e.message), {
        style: { borderRadius: '12px', background: '#333', color: '#fff' }
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', paddingBottom: '60px', background: '#fcfcfc' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '50px 40px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '20px' }}>
            <path d="M18 9.56H6M18 9.56L16.5 23.06H8.25L6 9.56M18 9.56C18 7.9687 17.3679 6.44258 16.2426 5.31736C15.1174 4.19214 13.5913 3.56 12 3.56C10.4087 3.56 8.88258 4.19214 7.75736 5.31736C6.63214 6.44258 6 7.9687 6 9.56M3.75 9.56H20.25" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.276 15.56L13.905 2.115C13.9496 1.91557 14.0345 1.72735 14.1544 1.5619C14.2743 1.39644 14.4268 1.25724 14.6025 1.15283C14.7782 1.04842 14.9733 0.981006 15.176 0.954726C15.3786 0.928445 15.5845 0.943852 15.781 1L19.5 2.06M7 15.56H17.333" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            {isLogin ? 'З поверненням' : 'Створити акаунт'}
          </h2>
          <p style={{ color: '#86868b', marginTop: '12px', fontSize: '15px', lineHeight: 1.5 }}>
            {isLogin ? 'Увійдіть для доступу до ваших замовлень та накопичених бонусів.' : 'Приєднуйтесь до нас та отримуйте бонуси за кожне замовлення.'}
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <input 
              type="text" placeholder="Ваше ім'я" required 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              style={{ padding: '16px', background: '#f5f5f7', border: 'none', color: '#1d1d1f', borderRadius: '14px', fontSize: '15px', fontWeight: 500, outline: 'none' }}
            />
          )}
          <input 
            type="email" placeholder="Email" required 
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            style={{ padding: '16px', background: '#f5f5f7', border: 'none', color: '#1d1d1f', borderRadius: '14px', fontSize: '15px', fontWeight: 500, outline: 'none' }}
          />
          <input 
            type="password" placeholder="Пароль" required 
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            style={{ padding: '16px', background: '#f5f5f7', border: 'none', color: '#1d1d1f', borderRadius: '14px', fontSize: '15px', fontWeight: 500, outline: 'none' }}
          />
          <button type="submit" className="btn" style={{ marginTop: '10px', background: 'var(--accent)', color: '#fff', border: 'none', padding: '16px', fontSize: '15px', borderRadius: '14px', fontWeight: 600 }}>
            {isLogin ? 'Увійти' : 'Продовжити'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p style={{ marginTop: '30px', color: '#86868b', fontSize: '14px' }}>
              {isLogin ? 'Немає акаунту? ' : 'Вже є акаунт? '}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', padding: 0 }}
              >
                <span style={{ color: '#000000', textDecoration: 'none', fontWeight: 600 }}>{isLogin ? 'Створити' : 'Увійти'}</span>
              </button>
            </p>
        </div>
      </div>
    </div>
  );
}
