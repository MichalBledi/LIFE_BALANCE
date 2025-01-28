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

export default router;
