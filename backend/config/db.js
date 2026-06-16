const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Create a wrapper to mimic async pg pool.query behavior
const pool = {
  query: (text, params) => {
    return new Promise((resolve, reject) => {
      try {
        const isSelect = text.trim().toUpperCase().startsWith('SELECT') || text.trim().toUpperCase().startsWith('PRAGMA');
        if (isSelect) {
          const rows = db.prepare(text).all(...(params || []));
          resolve({ rows });
        } else {
          const stmt = db.prepare(text);
          const result = stmt.run(...(params || []));
          resolve({ 
            rows: [{ id: result.lastInsertRowid }], 
            rowCount: result.changes,
            lastID: result.lastInsertRowid 
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }
};

module.exports = { pool, db };
