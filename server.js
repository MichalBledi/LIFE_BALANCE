import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

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


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
