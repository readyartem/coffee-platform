const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('./config/db');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', service: 'coffee-platform-api' }));

const JWT_SECRET = 'super-secret-key-for-diploma';

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Auth token missing' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const optionalAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

// Seed mockup data if empty
const seedData = async () => {
    try {
        const adminCheck = await pool.query("SELECT * FROM users WHERE email='admin@cafe.com'");
        if (adminCheck.rows.length === 0) {
            const hash = await bcrypt.hash('admin123', 10);
            await pool.query("INSERT INTO locations (name, address) VALUES ('Kyiv Center', 'Khreshchatyk 1')");
            const locRes = await pool.query("SELECT id FROM locations LIMIT 1");
            const locId = locRes.rows[0].id;
            await pool.query("INSERT INTO users (name, email, password_hash, role, location_id) VALUES ('Admin', 'admin@cafe.com', ?, 'admin', ?)", [hash, locId]);
            await pool.query("INSERT INTO categories (name, sort_order) VALUES ('Кава', 1), ('Десерти', 2)");
            await pool.query(`INSERT INTO menu_items (title, price, category_id, description, image_url) VALUES 
              ('Еспресо Black Onyx', 55, 1, 'Подвійний шот преміальної кави темного обсмаження.', '/coffee/espresso.jpg'), 
              ('Оксамитовий Лате', 75, 1, 'Шовковисте збите молоко з ноткою ванілі.', '/coffee/latte.jpg'), 
              ('Золота Матча', 90, 1, 'Церемоніальна матча з вівсяним молоком.', '/coffee/matcha.jpg'), 
              ('Капучино', 65, 1, 'Ідеальний баланс кави та ніжної пінки.', '/coffee/cappuccino.jpg'),
              ('Флет Вайт', 70, 1, 'Подвійний еспресо з гарячим молоком.', '/coffee/flat_white.jpg'),
              ('Тірамісу Нуар', 110, 2, 'Класичний італійський десерт з нашим фірмовим еспресо.', '/coffee/tiramisu.jpg'),
              ('Шоколадний Брауні', 85, 2, 'Насичений шоколадний десерт.', '/coffee/brownie.jpg'),
              ('Масляний Круасан', 65, 2, 'Класичний французький круасан з маслом.', '/coffee/croissant.jpg')
            `);
            console.log("Mock data seeded.");
        }
    } catch(e) {
        console.error("Seed error:", e);
    }
};
seedData();

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email=?', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, rows[0].password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: rows[0].id, role: rows[0].role, locationId: rows[0].location_id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: rows[0].id, name: rows[0].name, role: rows[0].role } });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'client')", [name, email, hash]);
    // Also create loyalty account
    await pool.query("CREATE TABLE IF NOT EXISTS loyalty_accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, balance INTEGER DEFAULT 0)");
    await pool.query("INSERT INTO loyalty_accounts (user_id, balance) VALUES (?, 100)", [result.lastID]); // 100 bonus for registration
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Profile Route
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRes = await pool.query('SELECT name, email, role FROM users WHERE id=?', [userId]);
    const ordersRes = await pool.query('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC', [userId]);
    
    // Check if loyalty table exists and get balance, or mock it
    let balance = 0;
    try {
        const loyalRes = await pool.query('SELECT balance FROM loyalty_accounts WHERE user_id=?', [userId]);
        if (loyalRes.rows.length > 0) balance = loyalRes.rows[0].balance;
    } catch(e) {}
    
    let populatedOrders = ordersRes.rows || [];
    if (populatedOrders.length > 0) {
        const orderIds = populatedOrders.map(o => o.id);
        const placeholders = orderIds.map(() => '?').join(',');
        const { rows: items } = await pool.query(`SELECT oi.*, m.title FROM order_items oi JOIN menu_items m ON oi.menu_item_id = m.id WHERE oi.order_id IN (${placeholders})`, orderIds);
        populatedOrders = populatedOrders.map(o => ({ ...o, items: items.filter(i => i.order_id === o.id) }));
    }
    
    res.json({
        user: userRes.rows[0],
        orders: populatedOrders,
        loyalty_balance: balance
    });
  } catch(e) {
      res.status(500).json({ error: e.message });
  }
});

// Menu Routes
app.get('/api/menu', async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.id WHERE m.is_available = 1');
      res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Order Routes
app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
      const { rows: orders } = await pool.query('SELECT o.*, u.name as user_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
      const { rows: items } = await pool.query('SELECT oi.*, m.title FROM order_items oi JOIN menu_items m ON oi.menu_item_id = m.id');
      const populated = orders.map(o => ({ ...o, items: items.filter(i => i.order_id === o.id) }));
      res.json(populated);
  } catch(e) { res.status(500).json({error: e.message}); }
});

app.post('/api/orders', optionalAuthMiddleware, async (req, res) => {
  const { locationId, items, type, total, paymentMethod, comment } = req.body;
  const userId = req.user ? req.user.id : null;
  const location_id = locationId || 1;
  try {
      // Handle loyalty
      if (paymentMethod === 'bonuses') {
          if (!userId) return res.status(401).json({ error: 'Необхідна авторизація для оплати бонусами' });
          const requiredBonuses = total * 10;
          const loyalRes = await pool.query('SELECT balance FROM loyalty_accounts WHERE user_id=?', [userId]);
          if (loyalRes.rows.length === 0 || loyalRes.rows[0].balance < requiredBonuses) {
              return res.status(400).json({ error: 'Недостатньо бонусів' });
          }
          await pool.query("UPDATE loyalty_accounts SET balance = balance - ? WHERE user_id = ?", [requiredBonuses, userId]);
      } else if (userId) {
          const earnedBonuses = Math.floor(total);
          await pool.query("UPDATE loyalty_accounts SET balance = balance + ? WHERE user_id = ?", [earnedBonuses, userId]);
      }

      const order = await pool.query(
        "INSERT INTO orders (user_id, location_id, status, total_price, type, comment, payment_method) VALUES (?, ?, 'new', ?, ?, ?, ?)",
        [userId, location_id, total, type, comment || '', paymentMethod || 'card']
      );
      const orderId = order.lastID;
      
      if (items && items.length > 0) {
          for (const item of items) {
              await pool.query("INSERT INTO order_items (order_id, menu_item_id, quantity, item_price) VALUES (?, ?, ?, ?)", [orderId, item.id, item.quantity, item.price]);
          }
      }

      let userName = 'Клієнт';
      if (userId) {
          const userRes = await pool.query("SELECT name FROM users WHERE id = ?", [userId]);
          if (userRes.rows.length > 0) userName = userRes.rows[0].name;
      }

      // get items back for websocket
      const { rows: savedItems } = await pool.query('SELECT oi.*, m.title FROM order_items oi JOIN menu_items m ON oi.menu_item_id = m.id WHERE oi.order_id = ?', [orderId]);

      const newOrder = { id: orderId, user_id: userId, user_name: userName, location_id, status: 'new', total_price: total, type, comment: comment || '', items: savedItems };
      app.get('io').emit('new-order', newOrder);
      res.status(201).json(newOrder);
  } catch (e) {
      res.status(500).json({error: e.message});
  }
});

app.patch('/api/orders/:id/status', authMiddleware, async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;
    
    if (status === 'declined') {
        const orderRes = await pool.query("SELECT user_id, total_price, payment_method, status FROM orders WHERE id = ?", [orderId]);
        if (orderRes.rows.length > 0) {
            const o = orderRes.rows[0];
            if (o.status !== 'declined' && o.user_id) {
                if (o.payment_method === 'bonuses') {
                    await pool.query("UPDATE loyalty_accounts SET balance = balance + ? WHERE user_id = ?", [o.total_price * 10, o.user_id]);
                } else {
                    await pool.query("UPDATE loyalty_accounts SET balance = balance - ? WHERE user_id = ?", [Math.floor(o.total_price), o.user_id]);
                }
            }
        }
    }
    
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    res.json({ success: true, status });
});

// Admin Management
app.get('/api/admins', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({error: 'Forbidden'});
    const { rows } = await pool.query("SELECT id, name, email FROM users WHERE role = 'admin'");
    res.json(rows);
});

app.post('/api/admins', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({error: 'Forbidden'});
    const { email } = req.body;
    const userRes = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (userRes.rows.length === 0) return res.status(404).json({error: 'Користувача з таким email не знайдено'});
    await pool.query("UPDATE users SET role = 'admin' WHERE id = ?", [userRes.rows[0].id]);
    res.json({ success: true, user: { id: userRes.rows[0].id, name: userRes.rows[0].name, email } });
});

app.delete('/api/admins/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({error: 'Forbidden'});
    if (req.user.id == req.params.id) return res.status(400).json({error: 'Не можна видалити себе'});
    
    const targetUser = await pool.query('SELECT email FROM users WHERE id = ?', [req.params.id]);
    if (targetUser.rows.length > 0 && targetUser.rows[0].email === 'admin@cafe.com') {
        return res.status(403).json({error: 'Головного адміністратора не можна видалити'});
    }

    await pool.query("UPDATE users SET role = 'client' WHERE id = ?", [req.params.id]);
    res.json({ success: true });
});

// Analytics Routes
app.get('/api/analytics', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("SELECT COUNT(id) as count, SUM(total_price) as revenue FROM orders WHERE status != 'declined'");
        
        const count = parseInt(result.rows[0].count) || 0;
        const revenue = parseFloat(result.rows[0].revenue) || 0;
        
        res.json({
            revenue: revenue,
            orders: count,
            chartData: []
        });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

io.on('connection', (socket) => {
  socket.on('join-location', (locationId) => {
    socket.join(`location-${locationId}`);
  });
});

// Ensure io is accessible in express
app.set('io', io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
