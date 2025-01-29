import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import bmiRoutes from './routes/bmiRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import ingredientsRoutes from './routes/ingredientsRoutes.js';
import nutritionCalcRoutes from './routes/nutritionCalcRoutes.js';


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
app.use('/api/nutrition', nutritionCalcRoutes);


// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
