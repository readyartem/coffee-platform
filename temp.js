const { pool } = require('./backend/config/db');
pool.query("UPDATE users SET role='admin' WHERE email='admin@cafe.com'").then(() => {
    console.log('Restored admin');
    process.exit(0);
});
