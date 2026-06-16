const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Create a wrapper to mimic async pg pool.query behavior
const pool = {
  query: (text, params) => {
    return new Promise((resolve, reject) => {
      const isSelect = text.trim().toUpperCase().startsWith('SELECT') || text.trim().toUpperCase().startsWith('PRAGMA');
      if (isSelect) {
        db.all(text, params, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows });
        });
      } else {
        db.run(text, params, function(err) {
          if (err) reject(err);
          else resolve({ 
            rows: [{ id: this.lastID }], 
            rowCount: this.changes,
            lastID: this.lastID 
          });
        });
      }
    });
  }
};

module.exports = { pool, db };
