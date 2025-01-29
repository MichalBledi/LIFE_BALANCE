import express from 'express';
import db from '../database/db.js';

const router = express.Router();
/*
// Route to get the number of ingredients
router.get('/ingredients/count', async (req, res) => {
    try {
        const [result] = await db.query('SELECT COUNT(*) AS ingredientCount FROM food');
        res.json({ ingredientCount: result.ingredientCount });
    } catch (error) {
        console.error('Error fetching ingredient count:', error);
        res.status(500).send('Server Error');
    }
});
*/
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

