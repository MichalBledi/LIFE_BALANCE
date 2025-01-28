/*import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

import mysql from 'mysql2/promise'; // For database queries
// MySQL database connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0908',
    database: 'life_balance_web',
});


const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('home.html', { root: 'public/home' });
});

app.use('/api', userRoutes);

app.use('/recipes', express.static('path_to_recipes_folder', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Serve the heatmap
app.get('/heatmap', (req, res) => {
    res.sendFile('heat_map/heat_map.html', { root: 'public' });
});

// Route: Fetch global BMI data by year and split into gender-specific tables
app.get('/api/global-bmi-data/:year', async (req, res) => {
    const { year } = req.params; // Get the year from the URL parameter

    try {
        // Query for records based on the specified year
        const [rows] = await db.query(`
            SELECT country, gender, bmi, bmi_min, bmi_max
            FROM global_bmi_data
            WHERE year = ?
        `, [year]);

        // Split data into three separate arrays based on gender
        const bothSexes = rows.filter(record => record.gender === 'Both');
        const males = rows.filter(record => record.gender === 'Male');
        const females = rows.filter(record => record.gender === 'Female');

        // Return the data as an object containing three arrays
        res.json({
            bothSexes,
            males,
            females,
        });
    } catch (err) {
        console.error('Error fetching BMI data:', err);
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

*/

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import bmiRoutes from './routes/bmiRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import ingredientsRoutes from './routes/ingredientsRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static('public'));

// Homepage
app.get('/', (req, res) => {
    res.sendFile('home.html', { root: 'public/home' });
});

// Recipes folder
app.use('/recipes', express.static('public/recipes', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Heatmap page
app.get('/heatmap', (req, res) => {
    res.sendFile('heat_map/heat_map.html', { root: 'public' });
});

// API Routes
app.use('/api', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use("/api/bmi", bmiRoutes);
app.use('/api/ingredients', ingredientsRoutes);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
