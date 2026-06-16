import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import api, { API_URL } from '../services/api';
import gsap from 'gsap';
import { Check, Clock, TrendingUp, X, User, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const typeMap = { inside: 'В закладі', online: 'Онлайн', takeaway: 'З собою' };

const getOrderDisplayData = (order) => {
    let displayName = order.user_name;
    if (!displayName || displayName === 'Клієнт') displayName = 'Невідомий клієнт';
    
    let displayComment = order.comment || '';
    if (!order.user_id && displayComment.startsWith('Клієнт:')) {
        const firstLineEnd = displayComment.indexOf('\n');
        if (firstLineEnd !== -1) {
            displayName = displayComment.substring(8, firstLineEnd).trim();
            displayComment = displayComment.substring(firstLineEnd + 1).trim();
        } else {
            displayName = displayComment.substring(8).trim();
            displayComment = '';
        }
    }
    
    return { displayName, displayComment };
};

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, count: 0 });
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    
    api.get('/api/analytics')
      .then(res => setStats({ revenue: res.data.revenue, count: res.data.orders }))
      .catch(() => setStats({ revenue: 15400, count: 98 })); // Fallback
      
      api.get('/api/orders')
      .then(res => setOrders(res.data))
      .catch(() => {
          setOrders([
              { id: 101, status: 'new', type: 'online', total_price: 150 },
              { id: 102, status: 'done', type: 'in-store', total_price: 75 }
          ]);
      });

    api.get('/api/admins')
      .then(res => setAdmins(res.data))
      .catch(() => {});

    // Setup WebSocket
    const socket = io(API_URL);
    // For demo we join location 1
    socket.emit('join-location', 1);
    
    socket.on('new-order', (order) => {
      setOrders(prev => [order, ...prev]);
      gsap.fromTo('.new-order-highlight', 
        { background: 'var(--accent)', color: '#000' },
        { background: 'transparent', color: 'var(--text-main)', duration: 2 }
      );
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    gsap.fromTo('.dash-card', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    );
  }, []);

  const toggleOrder = (id) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateStatus = async (id, newStatus) => {
    try {
        const token = localStorage.getItem('token') || '';
        await api.patch(`/api/orders/${id}/status`, { status: newStatus });
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch(e) {
        console.error(e);
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  }

  const handleAddAdmin = async (e) => {
      e.preventDefault();
      try {
          const token = localStorage.getItem('token') || '';
          const res = await api.post('/api/admins', { email: newAdminEmail });
          setAdmins(prev => [...prev, res.data.user]);
          setNewAdminEmail('');
          toast.success('Адміністратора успішно додано', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
      } catch (err) {
          toast.error(err.response?.data?.error || 'Помилка', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
      }
  };

  const handleRemoveAdmin = async (id, email) => {
      if (email === 'admin@cafe.com') {
          toast.error('Головного адміністратора не можна видалити!', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
          return;
      }
      try {
          const token = localStorage.getItem('token') || '';
          await api.delete(`/api/admins/${id}`);
          setAdmins(prev => prev.filter(a => a.id !== id));
          toast.success('Адміністратора видалено', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
      } catch (err) {
          toast.error(err.response?.data?.error || 'Помилка', { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
      }
  };

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px', background: 'var(--bg-color)' }}>
      <div className="container">
        <h2 className="display-title" style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '40px' }}>Дашборд</h2>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', borderBottom: '1px solid var(--border-glass)' }}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            style={{ padding: '10px 0', background: 'none', border: 'none', borderBottom: activeTab === 'dashboard' ? '2px solid var(--text-main)' : '2px solid transparent', fontWeight: 600, cursor: 'pointer', color: activeTab === 'dashboard' ? 'var(--text-main)' : '#86868b', fontSize: '16px', transition: 'all 0.3s' }}
          >Головна панель</button>
          <button 
            onClick={() => setActiveTab('orders')} 
            style={{ padding: '10px 0', background: 'none', border: 'none', borderBottom: activeTab === 'orders' ? '2px solid var(--text-main)' : '2px solid transparent', fontWeight: 600, cursor: 'pointer', color: activeTab === 'orders' ? 'var(--text-main)' : '#86868b', fontSize: '16px', transition: 'all 0.3s' }}
          >Всі замовлення (Історія)</button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Analytics Top Cards */}
            <div style={{ display: 'flex', gap: '30px', marginBottom: '50px' }}>
              <div className="glass-panel dash-card" style={{ flex: 1, padding: '30px', borderLeft: '4px solid var(--accent)', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#86868b', marginBottom: '20px', fontWeight: 500 }}>
                  <span>Дохід за день</span>
                  <TrendingUp size={20} color="var(--accent)" />
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
                  {stats.revenue.toLocaleString()} ₴
                </div>
              </div>
              <div className="glass-panel dash-card" style={{ flex: 1, padding: '30px', borderLeft: '4px solid #1d1d1f', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#86868b', marginBottom: '20px', fontWeight: 500 }}>
                  <span>Замовлень</span>
                  <Clock size={20} color="#1d1d1f" />
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
                  {stats.count}
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '20px' }}>Активні замовлення (Live)</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} className="dash-card">
              {orders.filter(o => o.status === 'new').map((order, idx) => {
                const isExpanded = expandedOrders.has(order.id);
                const { displayName, displayComment } = getOrderDisplayData(order);
                return (
                <div key={order.id} className={`glass-panel ${idx === 0 ? 'new-order-highlight' : ''}`} style={{ 
                  padding: '20px 30px', display: 'flex', flexDirection: 'column', gap: '15px',
                  background: '#fff', border: 'none'
                 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px', fontWeight: 600, width: '60px' }}>#{order.id}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1d1d1f', width: '220px' }}>
                          <User size={16} color="#86868b" />
                          <span style={{ fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</span>
                        </div>
                        <span style={{ fontSize: '14px', color: '#86868b', fontWeight: 500, width: '120px' }}>Тип: {typeMap[order.type] || order.type}</span>
                        <span style={{ fontSize: '18px', fontWeight: 600 }}>{order.total_price} ₴</span>
                      </div>
                      {displayComment && (
                        <div style={{ fontSize: '14px', color: '#86868b', background: '#f5f5f7', padding: '10px 15px', borderRadius: '12px', display: 'inline-block', alignSelf: 'flex-start', whiteSpace: 'pre-wrap' }}>
                          {displayComment}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginLeft: '20px' }}>
                        <span style={{ 
                            padding: '6px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 500,
                            background: 'rgba(245, 108, 0, 0.1)', color: 'var(--accent)'
                        }}>Нове</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn" style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', border: 'none', display: 'flex' }} onClick={() => updateStatus(order.id, 'declined')}>
                              <X size={18} />
                          </button>
                          <button className="btn" style={{ padding: '8px', borderRadius: '50%', background: '#e8e8ed', color: '#1d1d1f', border: 'none', display: 'flex' }} onClick={() => updateStatus(order.id, 'done')}>
                              <Check size={18} />
                          </button>
                          <button className="btn" style={{ padding: '8px', borderRadius: '50%', background: 'transparent', color: '#86868b', border: '1px solid #e8e8ed', display: 'flex' }} onClick={() => toggleOrder(order.id)}>
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ marginTop: '10px', paddingTop: '15px', borderTop: '1px solid var(--border-glass)' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#86868b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Склад замовлення:</h4>
                      {order.items && order.items.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {order.items.map((item, i) => (
                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                              <span>{item.quantity}x {item.title}</span>
                              <span style={{ fontWeight: 600 }}>{item.item_price * item.quantity} ₴</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: '14px', color: '#86868b' }}>Деталі замовлення недоступні (старе замовлення).</p>
                      )}
                    </div>
                  )}
                </div>
              )})}
              {orders.filter(o => o.status === 'new').length === 0 && <p style={{ color: '#86868b' }}>Немає активних замовлень.</p>}
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="dash-card">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '20px' }}>Історія всіх замовлень</h3>
            <div className="glass-panel" style={{ padding: '20px', background: '#fff', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#86868b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '15px' }}>ID</th>
                    <th style={{ padding: '15px' }}>Дата</th>
                    <th style={{ padding: '15px' }}>Клієнт</th>
                    <th style={{ padding: '15px' }}>Тип / Оплата</th>
                    <th style={{ padding: '15px' }}>Сума</th>
                    <th style={{ padding: '15px' }}>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const isExpanded = expandedOrders.has(order.id);
                    const { displayName, displayComment } = getOrderDisplayData(order);
                    return (
                    <React.Fragment key={order.id}>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                        <td style={{ padding: '15px', fontWeight: 600 }}>#{order.id}</td>
                        <td style={{ padding: '15px', color: '#86868b', fontSize: '14px' }}>{new Date(order.created_at || Date.now()).toLocaleString('uk-UA')}</td>
                        <td style={{ padding: '15px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={14} color="#86868b" />
                            <span style={{ fontWeight: 500 }}>{displayName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '15px', color: '#86868b', fontSize: '14px' }}>{typeMap[order.type] || order.type} / {order.payment_method}</td>
                        <td style={{ padding: '15px', fontWeight: 600 }}>{order.total_price} ₴</td>
                        <td style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                              <span style={{ 
                                  padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                  background: order.status === 'new' ? 'rgba(245, 108, 0, 0.1)' : order.status === 'declined' ? 'rgba(255, 59, 48, 0.1)' : '#f5f5f7',
                                  color: order.status === 'new' ? 'var(--accent)' : order.status === 'declined' ? '#ff3b30' : '#86868b',
                              }}>
                                  {order.status === 'new' ? 'Нове' : order.status === 'done' ? 'Виконано' : 'Відхилено'}
                              </span>
                          </div>
                          <button 
                            className="btn" 
                            style={{ padding: '6px', borderRadius: '50%', background: 'transparent', color: '#86868b', border: '1px solid #e8e8ed', display: 'flex', cursor: 'pointer' }} 
                            onClick={() => toggleOrder(order.id)}
                          >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr style={{ background: '#fcfcfc' }}>
                          <td colSpan="6" style={{ padding: '15px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Склад замовлення:</h4>
                            {order.items && order.items.length > 0 ? (
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {order.items.map((item, i) => (
                                  <li key={i} style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                                    <span style={{ fontWeight: 600, color: '#1d1d1f' }}>{item.quantity}x</span>
                                    <span style={{ flex: 1, color: '#1d1d1f' }}>{item.title}</span>
                                    <span style={{ fontWeight: 600 }}>{item.item_price * item.quantity} ₴</span>
                                  </li>
                                ))}
                                {displayComment && (
                                  <li style={{ marginTop: '8px', padding: '10px 15px', background: '#fff', borderRadius: '8px', fontSize: '13px', color: '#86868b', border: '1px solid var(--border-glass)', whiteSpace: 'pre-wrap' }}>
                                    <strong style={{ color: '#1d1d1f' }}>Коментар:</strong> {displayComment}
                                  </li>
                                )}
                              </ul>
                            ) : (
                              <p style={{ fontSize: '13px', color: '#86868b' }}>Деталі замовлення недоступні (старе замовлення).</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )})}
                </tbody>
              </table>
              {orders.length === 0 && <p style={{ color: '#86868b', padding: '20px', textAlign: 'center' }}>Історія замовлень порожня.</p>}
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', marginTop: '50px', marginBottom: '20px' }}>Управління Адміністраторами</h3>
        <div className="glass-panel" style={{ padding: '30px', background: '#fff' }}>
            <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <input 
                    type="email" 
                    placeholder="Email користувача" 
                    value={newAdminEmail}
                    onChange={e => setNewAdminEmail(e.target.value)}
                    required
                    style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--border-glass)', borderRadius: '4px', outline: 'none' }}
                />
                <button type="submit" className="btn">Додати Адміна</button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {admins.map(admin => (
                    <div key={admin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f9f9f9', borderRadius: '4px', border: '1px solid var(--border-glass)' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>{admin.name}</div>
                            <div style={{ fontSize: '13px', color: '#86868b' }}>{admin.email}</div>
                        </div>
                        {admin.email !== 'admin@cafe.com' && (
                            <button onClick={() => handleRemoveAdmin(admin.id, admin.email)} style={{ padding: '8px', background: 'transparent', border: 'none', color: '#ff3b30', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
