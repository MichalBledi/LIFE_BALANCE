import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'OANCZfamily825131423!',
    database: 'life_balance_web',
});

const allergyKeywords = {
    vegan: ['meat', 'fish', 'eggs', 'dairy', 'honey', 'gelatin'],
    vegetarian: ['meat', 'fish', 'gelatin'],
    glutenFree: ['wheat', 'flour', 'barley', 'rye', 'bread', 'pasta'],
    dairyFree: ['milk', 'cheese', 'butter', 'cream', 'yogurt'],
    peanutsFree: ['peanuts', 'peanut butter', 'peanut oil'],
    treeNutsFree: ['almonds', 'walnuts', 'cashews', 'hazelnuts', 'pecans', 'pistachios'],
    eggsFree: ['eggs', 'egg whites', 'mayonnaise'],
    fishFree: ['fish', 'salmon', 'tuna', 'cod', 'sardines'],
};

async function checkIndexes() {
    try {
        const [tables] = await db.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'life_balance_web'
              AND table_name LIKE 'index_allergy_%';
        `);

        const existingTables = tables.map(row => row.table_name);

        console.log('Existing allergy index tables:', existingTables);

        Object.keys(allergyKeywords).forEach(allergy => {
            const tableName = `index_allergy_${allergy}`;
            if (existingTables.includes(tableName)) {
                console.log(`✅ Table exists for allergy: ${allergy}`);
            } else {
                console.log(`❌ Missing table for allergy: ${allergy}`);
            }
        });
    } catch (error) {
        console.error('Error checking allergy index tables:', error);
    } finally {
        await db.end();
    }
}

checkIndexes();
