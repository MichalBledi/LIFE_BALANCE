import express from 'express';
import db from '../database/db.js';

const router = express.Router();

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
});

export default router;
