const { db } = require('./db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

db.exec(`CREATE TABLE IF NOT EXISTS locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  working_hours TEXT,
  manager_id INTEGER
)`);

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT,
  location_id INTEGER,
  FOREIGN KEY (location_id) REFERENCES locations(id)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sort_order INTEGER
)`);

db.exec(`CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  price REAL NOT NULL,
  category_id INTEGER,
  is_available BOOLEAN DEFAULT 1,
  image_url TEXT,
  description TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS modifiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  menu_item_id INTEGER,
  name TEXT NOT NULL,
  price_delta REAL,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  location_id INTEGER,
  status TEXT DEFAULT 'new',
  total_price REAL,
  type TEXT,
  comment TEXT,
  payment_method TEXT DEFAULT 'card',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  menu_item_id INTEGER,
  quantity INTEGER,
  applied_modifiers TEXT,
  item_price REAL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS loyalty_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  balance INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);

// Seed locations if empty
const locCount = db.prepare('SELECT COUNT(*) as cnt FROM locations').get();
if (locCount.cnt === 0) {
  db.exec(`
    INSERT INTO locations (name, address) VALUES ('Русанівка', 'Русанівська набережна');
    INSERT INTO locations (name, address) VALUES ('Березняки', 'вул. Березняківська 6');
    INSERT INTO locations (name, address) VALUES ('Печерськ', 'біля КНУТД');
  `);
  console.log("Локації додані!");
}

console.log("Таблиці успішно створені!");
