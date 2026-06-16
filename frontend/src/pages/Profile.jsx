import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Star, Coffee, LogOut, X, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const typeMap = { inside: 'В закладі', delivery: 'Доставка', online: 'Онлайн', takeaway: 'З собою' };

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const navigate = useNavigate();

  const toggleOrder = (id) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    
    api.get('/api/user/profile')
    .then(res => {
      setProfile(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      navigate('/auth');
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleCancel = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await api.patch(`/api/orders/${id}/status`, { status: 'declined' });
        setProfile(prev => ({ ...prev, orders: prev.orders.map(o => o.id === id ? { ...o, status: 'declined' } : o) }));
        toast.success('Замовлення скасовано', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
    } catch(e) {
        toast.error('Помилка скасування', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
    }
  };

  if (loading) return <div style={{ paddingTop: '150px', textAlign: 'center', color: '#86868b' }}>Завантаження...</div>;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px', background: 'var(--bg-color)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Особистий Кабінет</h2>
            <button onClick={handleLogout} className="btn" style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', color: '#1d1d1f' }}>
                <LogOut size={20} />
            </button>
        </div>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            {/* User Info Card */}
            <div className="glass-panel" style={{ flex: '1 1 300px', padding: '40px', background: '#fff', border: 'none' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', marginBottom: '10px' }}>ПРОФІЛЬ</div>
                <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '5px', letterSpacing: '-0.01em' }}>{profile.user.name}</h3>
                <p style={{ color: '#86868b', fontSize: '15px', marginBottom: '30px' }}>{profile.user.email}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', background: 'rgba(245, 108, 0, 0.05)', borderRadius: '20px', border: '1px solid rgba(245, 108, 0, 0.1)' }}>
                    <Star color="var(--accent)" size={32} fill="var(--accent)" />
                    <div>
                        <div style={{ fontSize: '13px', color: '#86868b', fontWeight: 500 }}>Ваші бонуси</div>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.03em' }}>{profile.loyalty_balance}</div>
                    </div>
                </div>
            </div>

            {/* Order History */}
            <div className="glass-panel" style={{ flex: '2 1 450px', padding: '40px', background: '#fff', border: 'none' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '30px' }}>Історія Замовлень</h3>
                
                {profile.orders.length === 0 ? (
                    <p style={{ color: '#86868b' }}>У вас ще немає замовлень.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {profile.orders.map(order => {
                            const isExpanded = expandedOrders.has(order.id);
                            return (
                            <div key={order.id} style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ background: '#f5f5f7', padding: '12px', borderRadius: '50%' }}>
                                            <Coffee size={24} color="#1d1d1f" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '17px', fontWeight: 600 }}>Замовлення #{order.id}</div>
                                            <div style={{ fontSize: '13px', color: '#86868b', marginTop: '4px', fontWeight: 500 }}>
                                                Тип: {typeMap[order.type] || order.type} • <span style={{ color: order.status === 'new' ? 'var(--accent)' : order.status === 'declined' ? '#ff3b30' : '#86868b' }}>{order.status === 'new' ? 'Нове' : order.status === 'done' ? 'Виконано' : 'Скасовано'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <div style={{ fontSize: '20px', fontWeight: 600 }}>
                                            {order.total_price} ₴
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {order.status === 'new' && (
                                                <button onClick={() => handleCancel(order.id)} className="btn" style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', border: 'none', display: 'flex', cursor: 'pointer' }}>
                                                    <X size={18} />
                                                </button>
                                            )}
                                            <button 
                                                className="btn" 
                                                style={{ padding: '8px', borderRadius: '50%', background: 'transparent', color: '#86868b', border: '1px solid #e8e8ed', display: 'flex', cursor: 'pointer' }} 
                                                onClick={() => toggleOrder(order.id)}
                                            >
                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Склад замовлення:</h4>
                                        {order.items && order.items.length > 0 ? (
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {order.items.map((item, i) => (
                                                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                        <span style={{ color: '#1d1d1f' }}><span style={{ fontWeight: 600, marginRight: '10px' }}>{item.quantity}x</span> {item.title}</span>
                                                        <span style={{ fontWeight: 600 }}>{item.item_price * item.quantity} ₴</span>
                                                    </li>
                                                ))}
                                                {order.comment && (
                                                    <li style={{ marginTop: '10px', padding: '10px 15px', background: '#f5f5f7', borderRadius: '8px', fontSize: '13px', color: '#86868b', whiteSpace: 'pre-wrap' }}>
                                                        <strong style={{ color: '#1d1d1f' }}>Коментар:</strong> {order.comment}
                                                    </li>
                                                )}
                                            </ul>
                                        ) : (
                                            <p style={{ fontSize: '13px', color: '#86868b' }}>Деталі недоступні.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
