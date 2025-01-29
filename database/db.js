import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'OANCZfamily825131423!',
    database: 'life_balance_web',
});

pool.getConnection()
    .then((connection) => {
        console.log('✅ MySQL connected successfully!');
        connection.release(); // שחרור החיבור
    })
    .catch((err) => {
        console.error('❌ MySQL connection failed:', err);
    });

export default pool;
