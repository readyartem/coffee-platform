import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { MapPin, Clock, CreditCard, Gift, X } from 'lucide-react';

export default function Checkout() {
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ type: 'inside', locationId: 3, comment: '', paymentMethod: 'card', name: '', phone: '', arrivalTime: 'Зараз', customArrivalTime: '' });
  const [deliveryData, setDeliveryData] = useState({ street: '', house: '', apartment: '', entrance: '', floor: '' });
  const [balance, setBalance] = React.useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  React.useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          setIsAuthenticated(true);
          api.get('/api/user/profile')
            .then(res => { setBalance(res.data.loyalty_balance || 0); setLoading(false); })
            .catch(() => { setIsAuthenticated(false); setLoading(false); });
      } else {
          setLoading(false);
      }
  }, []);
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) return <div style={{ paddingTop: '150px', textAlign: 'center', color: '#86868b' }}>Завантаження...</div>;

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '150px', textAlign: 'center' }}>
        <h2>Кошик порожній</h2>
        <button className="btn" onClick={() => navigate('/menu')} style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>В меню</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token && formData.paymentMethod === 'bonuses') {
      toast.error('Увійдіть в акаунт, щоб використати бонуси', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
      return;
    }

    const loadingToast = toast.loading('Оформлення...', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
    
    const customerNameInfo = (!token && formData.name) ? `Клієнт: ${formData.name}${formData.phone ? ` (${formData.phone})` : ''}\n` : '';
    const arrivalTimeFinal = formData.arrivalTime === 'Інший час' ? formData.customArrivalTime : formData.arrivalTime;
    const arrivalInfo = formData.type === 'inside' && arrivalTimeFinal ? `Час: ${arrivalTimeFinal}\n` : '';
    const fullComment = customerNameInfo + arrivalInfo + (formData.type === 'delivery' 
      ? `Доставка:\nВулиця: ${deliveryData.street}, Буд: ${deliveryData.house}${deliveryData.apartment ? `, Кв: ${deliveryData.apartment}` : ''}${deliveryData.entrance ? `, Під'їзд: ${deliveryData.entrance}` : ''}${deliveryData.floor ? `, Поверх: ${deliveryData.floor}` : ''}\n\nКоментар: ${formData.comment}` 
      : formData.comment);

    try {
      await api.post('/api/orders', {
        locationId: formData.locationId,
        type: formData.type,
        total: total,
        paymentMethod: formData.paymentMethod,
        items: cart.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
        comment: fullComment
      });
      
      toast.dismiss(loadingToast);
      toast.success('Замовлення успішно оформлено!', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
      clearCart();
      if (token) navigate('/profile');
      else navigate('/');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || 'Помилка сервера. Спробуйте ще.', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px', background: 'var(--bg-color)' }}>
      <div className="container" style={{ maxWidth: '1000px', display: 'flex', gap: '40px', flexWrap: 'wrap', margin: '0 auto', padding: '0 4vw' }}>
        
        {/* Left column: Form */}
        <div style={{ flex: '1 1 500px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '30px' }}>Оформлення замовлення</h1>
            
            {!isAuthenticated && (
                <div className="glass-panel" style={{ padding: '24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '20px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => navigate('/auth')} onMouseOver={e=>e.currentTarget.style.opacity=0.9} onMouseOut={e=>e.currentTarget.style.opacity=1}>
                    <Gift size={32} color="#fff" />
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '5px' }}>Зареєструйтесь і отримуйте бонуси!</h3>
                        <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: 1.4 }}>Отримайте 100 бонусів прямо зараз, щоб замовляти каву безкоштовно в майбутньому.</p>
                    </div>
                </div>
            )}
            
            <form id="checkout-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {!isAuthenticated && (
                    <div className="glass-panel" style={{ padding: '30px', background: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Ваші дані</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input type="text" placeholder="Ваше ім'я" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '16px', background: '#f5f5f7', border: 'none', borderRadius: '14px', fontSize: '15px', outline: 'none' }} required />
                            <input type="tel" placeholder="Номер телефону" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '16px', background: '#f5f5f7', border: 'none', borderRadius: '14px', fontSize: '15px', outline: 'none' }} required />
                        </div>
                    </div>
                )}
                
                <div className="glass-panel" style={{ padding: '30px', background: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={20} color="var(--accent)" /> Тип замовлення
                    </h3>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <label style={{ flex: 1, textAlign: 'center', padding: '16px', background: formData.type === 'inside' ? '#000000' : '#ffffff', border: formData.type === 'inside' ? '1px solid #000000' : '1px solid #e5e5e5', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <input type="radio" name="type" value="inside" checked={formData.type === 'inside'} onChange={() => setFormData({...formData, type: 'inside'})} style={{ display: 'none' }} />
                            <span style={{ fontSize: '15px', fontWeight: 500, color: formData.type === 'inside' ? '#ffffff' : '#000000' }}>В закладі</span>
                        </label>
                        <label style={{ flex: 1, textAlign: 'center', padding: '16px', background: formData.type === 'delivery' ? '#000000' : '#ffffff', border: formData.type === 'delivery' ? '1px solid #000000' : '1px solid #e5e5e5', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <input type="radio" name="type" value="delivery" checked={formData.type === 'delivery'} onChange={() => setFormData({...formData, type: 'delivery'})} style={{ display: 'none' }} />
                            <span style={{ fontSize: '15px', fontWeight: 500, color: formData.type === 'delivery' ? '#ffffff' : '#000000' }}>Доставка</span>
                        </label>
                    </div>
                    {formData.type === 'delivery' && (
                        <div style={{ marginTop: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '15px' }}>Адреса доставки</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <input type="text" placeholder="Вулиця" value={deliveryData.street} onChange={e => setDeliveryData({...deliveryData, street: e.target.value})} style={{ width: '100%', padding: '16px', background: '#f5f5f7', border: 'none', borderRadius: '12px', fontSize: '15px', outline: 'none' }} required />
                                <input type="text" placeholder="Будинок" value={deliveryData.house} onChange={e => setDeliveryData({...deliveryData, house: e.target.value})} style={{ width: '100%', padding: '16px', background: '#f5f5f7', border: 'none', borderRadius: '12px', fontSize: '15px', outline: 'none' }} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                                <input type="text" placeholder="Квартира" value={deliveryData.apartment} onChange={e => setDeliveryData({...deliveryData, apartment: e.target.value})} style={{ width: '100%', padding: '16px', background: '#f5f5f7', border: 'none', borderRadius: '12px', fontSize: '15px', outline: 'none' }} />
                                <input type="text" placeholder="Під'їзд" value={deliveryData.entrance} onChange={e => setDeliveryData({...deliveryData, entrance: e.target.value})} style={{ width: '100%', padding: '16px', background: '#f5f5f7', border: 'none', borderRadius: '12px', fontSize: '15px', outline: 'none' }} />
                                <input type="text" placeholder="Поверх" value={deliveryData.floor} onChange={e => setDeliveryData({...deliveryData, floor: e.target.value})} style={{ width: '100%', padding: '16px', background: '#f5f5f7', border: 'none', borderRadius: '12px', fontSize: '15px', outline: 'none' }} />
                            </div>
                        </div>
                    )}
                    {formData.type === 'inside' && (
                        <div style={{ marginTop: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '15px' }}>Через скільки ви будете?</h3>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: formData.arrivalTime === 'Інший час' ? '15px' : '0' }}>
                                {['Зараз', 'Через 5 хв', 'Через 15 хв', 'Інший час'].map(time => (
                                    <label key={time} style={{ flex: '1 1 auto', textAlign: 'center', padding: '12px 16px', background: formData.arrivalTime === time ? 'rgba(197,160,89,0.05)' : '#f5f5f7', border: formData.arrivalTime === time ? '2px solid var(--accent)' : '2px solid transparent', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <input type="radio" name="arrivalTime" value={time} checked={formData.arrivalTime === time} onChange={() => setFormData({...formData, arrivalTime: time})} style={{ display: 'none' }} />
                                        <span style={{ fontSize: '14px', fontWeight: 500, color: formData.arrivalTime === time ? 'var(--accent)' : '#1d1d1f' }}>{time}</span>
                                    </label>
                                ))}
                            </div>
                            {formData.arrivalTime === 'Інший час' && (
                                <input 
                                    type="text" 
                                    placeholder="Вкажіть час (напр. 14:30 або через годину)" 
                                    value={formData.customArrivalTime} 
                                    onChange={e => setFormData({...formData, customArrivalTime: e.target.value})} 
                                    style={{ width: '100%', padding: '16px', background: '#f5f5f7', border: 'none', borderRadius: '14px', fontSize: '15px', outline: 'none' }} 
                                    required={formData.arrivalTime === 'Інший час'} 
                                />
                            )}
                        </div>
                    )}
                </div>

                {formData.type !== 'delivery' && (
                    <div className="glass-panel" style={{ padding: '30px', background: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={20} color="var(--accent)" /> Виберіть локацію
                        </h3>
                        <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                            {[
                                { id: 3, name: 'Печерськ, біля КНУТД' },
                                { id: 2, name: 'Березняки, вул. Березняківська 6' },
                                { id: 1, name: 'Русанівка, Русанівська набережна' }
                            ].map(loc => (
                                <label key={loc.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: formData.locationId === loc.id ? 'rgba(197,160,89,0.05)' : '#f5f5f7', border: formData.locationId === loc.id ? '2px solid var(--accent)' : '2px solid transparent', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.3s' }}>
                                    <input type="radio" name="location" value={loc.id} checked={formData.locationId === loc.id} onChange={() => setFormData({...formData, locationId: loc.id})} style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
                                    <span style={{ fontSize: '15px', fontWeight: 500 }}>{loc.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="glass-panel" style={{ padding: '30px', background: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CreditCard size={20} color="var(--accent)" /> Оплата
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: formData.paymentMethod === 'card' ? 'rgba(197,160,89,0.05)' : '#f5f5f7', border: formData.paymentMethod === 'card' ? '2px solid var(--accent)' : '2px solid transparent', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.3s' }}>
                            <input type="radio" name="payment" value="card" checked={formData.paymentMethod === 'card'} onChange={() => setFormData({...formData, paymentMethod: 'card'})} style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
                            <span style={{ fontSize: '15px', fontWeight: 600, flex: 1, color: formData.paymentMethod === 'card' ? 'var(--accent)' : '#1d1d1f' }}>Картка / Готівка при отриманні</span>
                            <span style={{ fontSize: '13px', color: '#86868b' }}>+{Math.floor(total)} бонусів</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: formData.paymentMethod === 'bonuses' ? 'rgba(197,160,89,0.05)' : '#f5f5f7', border: formData.paymentMethod === 'bonuses' ? '2px solid var(--accent)' : '2px solid transparent', borderRadius: '14px', cursor: formData.paymentMethod === 'bonuses' ? 'pointer' : balance >= total * 10 ? 'pointer' : 'not-allowed', opacity: balance >= total * 10 ? 1 : 0.5, transition: 'all 0.3s' }}>
                            <input type="radio" name="payment" value="bonuses" checked={formData.paymentMethod === 'bonuses'} disabled={balance < total * 10} onChange={() => setFormData({...formData, paymentMethod: 'bonuses'})} style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
                            <span style={{ fontSize: '15px', fontWeight: 600, flex: 1, color: formData.paymentMethod === 'bonuses' ? 'var(--accent)' : '#1d1d1f' }}>Списати бонуси</span>
                            <span style={{ fontSize: '13px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '4px' }}><Gift size={14} /> -{total * 10} (Баланс: {balance})</span>
                        </label>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '30px', background: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Коментар
                    </h3>
                    <textarea 
                        placeholder="Коментар до замовлення (необов'язково)"
                        value={formData.comment}
                        onChange={(e) => setFormData({...formData, comment: e.target.value})}
                        style={{ width: '100%', padding: '16px', background: '#f5f5f7', border: 'none', borderRadius: '14px', minHeight: '100px', fontSize: '15px', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
                    />
                </div>
            </form>
        </div>

        {/* Right column: Receipt */}
        <div style={{ flex: '1 1 350px' }}>
            <div className="glass-panel" style={{ padding: '30px', background: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'sticky', top: '120px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Ваше замовлення</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {cart.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '8px', backgroundImage: `url(${item.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>{item.title}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button 
                                            type="button"
                                            onClick={() => { if (item.quantity > 1) updateQuantity(item.id, -1); }}
                                            disabled={item.quantity <= 1}
                                            style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f5f5f7', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: item.quantity > 1 ? 'pointer' : 'default', fontSize: '14px', color: item.quantity > 1 ? '#86868b' : '#d1d1d6' }}
                                        >-</button>
                                        <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button 
                                            type="button"
                                            onClick={() => updateQuantity(item.id, 1)}
                                            style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f5f5f7', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', color: '#86868b' }}
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.price * item.quantity} ₴</div>
                                <button 
                                    type="button"
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 59, 48, 0.2)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 700 }}>
                        <span>До сплати:</span>
                        <span>{formData.paymentMethod === 'bonuses' ? `${total * 10} Б` : `${total} ₴`}</span>
                    </div>
                </div>
                <button 
                    form="checkout-form"
                    type="submit"
                    disabled={formData.paymentMethod === 'bonuses' && balance < total * 10}
                    style={{ width: '100%', padding: '18px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 600, cursor: (formData.paymentMethod === 'bonuses' && balance < total * 10) ? 'not-allowed' : 'pointer', transition: 'opacity 0.3s', opacity: (formData.paymentMethod === 'bonuses' && balance < total * 10) ? 0.5 : 1 }}
                    onMouseOver={e=>e.currentTarget.style.opacity= (formData.paymentMethod === 'bonuses' && balance < total * 10) ? 0.5 : 0.9}
                    onMouseOut={e=>e.currentTarget.style.opacity= (formData.paymentMethod === 'bonuses' && balance < total * 10) ? 0.5 : 1}
                >
                    Підтвердити та Оплатити
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}
