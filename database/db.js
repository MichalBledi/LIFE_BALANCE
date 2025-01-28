import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0908',
    database: 'life_balance_web',
});

// Export the pool for other files to use
export default pool;
