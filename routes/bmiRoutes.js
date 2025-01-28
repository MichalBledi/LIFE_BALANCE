import express from 'express';
import db from '../database/db.js';

const router = express.Router();

// GET BMI data for men by year
  router.get('/heatmap', async (req, res) => {
    const { year, gender } = req.query;
    //console.log(`Received Request: /heatmap?year=${year}&gender=${gender}`);

    try {
        const sql = `
            SELECT 
                country, 
                AVG(bmi) AS avg_bmi
            FROM 
                global_bmi_data
            WHERE 
                year = ?
                AND (gender = ? OR ? = 'Both')
            GROUP BY 
                country
        `;
        
        const params = [year, gender, gender];

        const [rows] = await db.query(sql, params);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No data found for this selection" });
        }

        res.json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

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


export default router;
