import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0908',
    database: 'life_balance_web',
});

pool.getConnection()
    .then((connection) => {
        console.log('✅ MySQL connected successfully!');
        connection.release();
    })
    .catch((err) => {
        console.error('❌ MySQL connection failed:', err);
    });

export default pool;
