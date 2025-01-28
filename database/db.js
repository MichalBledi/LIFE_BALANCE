import mysql from 'mysql2/promise';

// יצירת חיבור למסד הנתונים
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0908',
    database: 'life_balance_web',
});

// בדיקת חיבור
pool.getConnection()
    .then((connection) => {
        console.log('✅ MySQL connected successfully!');
        connection.release(); // שחרור החיבור
    })
    .catch((err) => {
        console.error('❌ MySQL connection failed:', err);
    });

export default pool;
