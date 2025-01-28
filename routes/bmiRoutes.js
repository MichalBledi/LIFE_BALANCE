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

router.get('/bmi-data', async (req, res) => {
    try {
        const query = `
            SELECT 
                country,
                gender,
                year,
                AVG(bmi) AS avg_bmi
            FROM 
                global_bmi_data
            WHERE 
                year BETWEEN 1996 AND 2016
            GROUP BY 
                country, gender, year
            ORDER BY 
                country, gender, year;
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching BMI data:', error);
        res.status(500).json({ error: 'Failed to fetch BMI data' });
    }
});

// Fetch BMI history for a specific user
router.get('/bmi-history/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `
            SELECT date, bmi 
            FROM bmi_history
            WHERE user_id = ?
            ORDER BY date ASC;
        `;
        const [rows] = await db.query(query, [userId]);

        if (!rows.length) {
            return res.status(404).json({ error: 'No BMI history found for this user' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching BMI history:', error);
        res.status(500).json({ error: 'Failed to fetch BMI history' });
    }
});

export default router;
