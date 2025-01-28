import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'OANCZfamily825131423!',
    database: 'life_balance_web',
});

// Allergy keyword mapping
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

async function createAndPopulateIndexTables() {
    try {
        for (const [allergy, keywords] of Object.entries(allergyKeywords)) {
            const tableName = `index_allergy_${allergy.replace(/-/g, '_')}`;

            console.log(`Dropping existing table (if exists): ${tableName}`);
            await db.query(`DROP TABLE IF EXISTS ${tableName}`);

            console.log(`Creating table: ${tableName}`);
            await db.query(`
                CREATE TABLE ${tableName} (
                    id INT PRIMARY KEY,
                    name VARCHAR(255),
                    ingredients TEXT,
                    nutrition TEXT,
                    photo VARCHAR(255),
                    minutes INT NOT NULL
                )
            `);
            console.log(`Table ${tableName} created successfully.`);

            // Populate table with 30 recipes that don't include allergy keywords
            const placeholders = keywords.map(() => `ingredients NOT LIKE ?`).join(' AND ');
            const query = `
                INSERT INTO ${tableName} (id, name, ingredients, nutrition, photo, minutes)
                SELECT id, name, ingredients, nutrition, photo, minutes
                FROM recipes
                WHERE ${placeholders}
                ORDER BY minutes ASC  -- Order by shortest prep time first
                LIMIT 30
            `;

            await db.query(query, keywords.map(keyword => `%${keyword}%`));
            console.log(`Table ${tableName} populated.`);
        }
    } catch (error) {
        console.error('Error creating or populating index tables:', error);
    } finally {
        await db.end();
    }
}

createAndPopulateIndexTables();
