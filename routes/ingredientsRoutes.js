import express from 'express';
import db from '../database/db.js';

const router = express.Router();


// Route to get the total number of ingredients
router.get('/count', async (req, res) => {
    try {
        console.log("Fetching ingredient count...");
        
        const [result] = await db.query('SELECT COUNT(*) AS count FROM food');
        console.log("Ingredient count result:", result);

        res.json({ count: result[0].count });
    } catch (error) {
        console.error('Error fetching ingredient count:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Route to search for ingredients
router.get('/search-ingredient', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const [rows] = await db.query(`
            SELECT food_name
            FROM food
            WHERE food_name LIKE ?
            LIMIT 100
        `, [`%${query}%`]);

        res.json(rows); // Send the matching ingredients back as JSON
    } catch (err) {
        console.error('Error fetching ingredients:', err);
        res.status(500).json({ error: 'Failed to fetch ingredients.' });
    }
});
export default router;
/*
// 🔍 חיפוש חכם של מצרכים לפי שם
router.get('/search', async (req, res) => {
    const searchTerm = req.query.q || ''; // קבלת הפרמטר מהבקשה

    try {
        // שאילתת SQL לשליפת המצרכים מהטבלה `food`
        const query = `
            SELECT 
                food_name, 
                caloric_value, 
                fat, 
                saturated_fats, 
                carbohydrates, 
                sugars, 
                protein,
                dietary_fiber,
                cholesterol,
                sodium,
                water,
                calcium,  -- שגיאת כתיב תוקנה
                iron,
                potassium,
                vitamin_c,
                vitamin_d,
                nutrition_density
            FROM food
            WHERE food_name LIKE ?
            ORDER BY food_name
            LIMIT 10; -- החזרת 10 תוצאות בלבד
        `;

        const searchPattern = `%${searchTerm}%`; // התאמה לכל מקום בשם המצרך
        const [ingredients] = await db.query(query, [searchPattern]);

        if (ingredients.length === 0) {
            return res.status(404).json({ error: "No ingredients found" });
        }

        res.json(ingredients);
    } catch (err) {
        console.error('❌ Error searching for ingredient:', err);
        res.status(500).json({ error: 'Failed to search ingredient.' });
    }
});*/

