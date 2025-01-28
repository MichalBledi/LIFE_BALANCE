import db from '../database/db.js';

export const getGlobalBmiData = async (req, res) => {
    const { year } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT country, gender, bmi, bmi_min, bmi_max
            FROM global_bmi_data
            WHERE year = ?
        `, [year]);

        const bothSexes = rows.filter(record => record.gender === 'Both');
        const males = rows.filter(record => record.gender === 'Male');
        const females = rows.filter(record => record.gender === 'Female');

        res.json({ bothSexes, males, females });
    } catch (err) {
        console.error('Error fetching BMI data:', err);
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
};
