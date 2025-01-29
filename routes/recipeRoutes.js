import express from 'express';
import db from '../database/db.js';

const router = express.Router();


router.get('/categories-count', async (req, res) => {
    try {
        console.log("📡 Received request to /api/recipes/categories-count");

        const query = `
            SELECT TRIM(BOTH '"' FROM TRIM(tag)) AS tag, COUNT(*) AS count 
            FROM (
                SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(tags, ',', n.n), ',', -1) AS tag
                FROM recipes
                JOIN (
                    SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
                    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
                ) n ON CHAR_LENGTH(tags) - CHAR_LENGTH(REPLACE(tags, ',', '')) >= n.n - 1
                WHERE tags IS NOT NULL AND tags != ''
            ) tag_table
            WHERE tag IS NOT NULL AND tag != ''
            GROUP BY tag
            ORDER BY count DESC
            LIMIT 10;
        `;

        const [results] = await db.query(query);

        if (!results || results.length === 0) {
            console.log("❌ No category data found in the database.");
            return res.status(404).json({ error: "No recipe categories found. Make sure recipes have tags!" });
        }

        console.log("📊 Raw Query Results:", results);

        const categories = results
            .map(row => row.tag ? row.tag.replace(/\[|\]|'/g, "").trim() : null)
            .filter(tag => tag && tag.length > 0);

        const counts = results
            .map(row => row.count !== undefined ? row.count : 0);

        console.log("✅ Final Data:", { labels: categories, counts: counts });

        res.json({ labels: categories, counts: counts });
    } catch (error) {
        console.error('❌ Error fetching category count:', error);
        res.status(500).json({ error: 'Failed to fetch category count.' });
    }
});



// Fetch recipes with a hard limit of 15
router.get('/', async (req, res) => {
    const category = req.query.category || null; // Optional category filter

    try {
        // SQL query to fetch up to 15 recipes with optional filtering by category
        const query = `
            SELECT 
                id, 
                name, 
                minutes AS cookingTime, 
                nutrition, 
                tags, 
                photo, 
                uploader
            FROM recipes
            ${category ? `WHERE tags LIKE '%${category}%'` : ''}
            LIMIT 15;
        `;

        // Execute the query
        const [recipes] = await db.query(query);

        res.json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ error: 'Failed to fetch recipes.' });
    }
});

// Fetch the top 10 most saved recipes in the last month
router.get('/popular', async (req, res) => {
    try {
        const query = `
            SELECT 
                r.id, 
                r.name, 
                r.minutes AS cookingTime, 
                r.photo, 
                COUNT(sr.recipe_id) AS save_count
            FROM saved_recipes sr
            JOIN recipes r ON sr.recipe_id = r.id
            WHERE sr.saved_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) -- Last month's saves
            GROUP BY r.id, r.name, r.minutes, r.photo
            ORDER BY save_count DESC
            LIMIT 10;
        `;

        const [popularRecipes] = await db.query(query);

        res.json(popularRecipes);
    } catch (err) {
        console.error('Error fetching popular recipes:', err);
        res.status(500).json({ error: 'Failed to fetch popular recipes.' });
    }
});

// Search for recipes based on a search term
router.get('/search', async (req, res) => {
    const searchTerm = req.query.q || ''; // Get the search term from the query string

    try {
        // SQL query to search for recipes by name or tags (partial match)
        const query = `
            SELECT 
                id, 
                name, 
                minutes AS cookingTime, 
                nutrition, 
                tags, 
                photo, 
                uploader
            FROM recipes
            WHERE name LIKE ? OR tags LIKE ?
            LIMIT 15; -- Limit to 15 results
        `;

        const searchPattern = `%${searchTerm}%`; // Match anywhere in the field
        const [recipes] = await db.query(query, [searchPattern, searchPattern]);

        res.json(recipes);
    } catch (err) {
        console.error('Error searching for recipes:', err);
        res.status(500).json({ error: 'Failed to search recipes.' });
    }
});

const allergyKeywords = {
    vegan: ['meat', 'fish', 'eggs', 'dairy', 'honey', 'gelatin'],
    vegetarian: ['meat', 'fish', 'gelatin'],
    glutenfree: ['wheat', 'flour', 'barley', 'rye', 'bread', 'pasta'],
    dairyfree: ['milk', 'cheese', 'butter', 'cream', 'yogurt'],
    peanutsfree: ['peanuts', 'peanut butter', 'peanut oil'],
    treefutsfree: ['almonds', 'walnuts', 'cashews', 'hazelnuts', 'pecans', 'pistachios'],
    eggsfree: ['eggs', 'egg whites', 'mayonnaise'],
    fishfree: ['fish', 'salmon', 'tuna', 'cod', 'sardines']
};

router.post('/filter', async (req, res) => {
    const { allergies = [], maxPrepTime, maxCalories } = req.body;

    console.log('Full filter request received:');
    console.log('Original Allergies:', allergies);

    const normalizedAllergies = allergies.map(allergy => allergy.replace(/-/g, '').toLowerCase());
    console.log('Normalized Allergies:', normalizedAllergies);

    try {
        let results = [];

        for (const allergy of normalizedAllergies) {
            console.log(`Processing allergy: ${allergy}`);

            if (!allergyKeywords[allergy]) {
                console.error(`Unknown allergy: ${allergy}`);
                continue; // Skip unknown allergies
            }

            const tableName = `index_allergy_${allergy}`;
            const placeholders = allergyKeywords[allergy].map(() => `ingredients NOT LIKE ?`).join(' AND ');

            const query = `
                SELECT id, name, ingredients, nutrition, photo, minutes AS cookingTime,
                    CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(nutrition, ',', 1), '[', -1) AS DECIMAL(10,2)) AS calories
                FROM ${tableName}
                ${maxCalories ? 'WHERE CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(nutrition, \',\', 1), \'[\', -1) AS DECIMAL(10,2)) <= ?' : ''}
                ORDER BY minutes ASC
                LIMIT 30;
            `;

            const params = allergyKeywords[allergy].map(keyword => `%${keyword}%`);
            if (maxCalories) {
                params.push(maxCalories);
            }

            console.log('Executing query:', query);
            console.log('Query parameters:', params);

            const [rows] = await db.query(query, params);
            /*
            console.log(`Query results for allergy "${allergy}":`, rows);
            */
            results.push(...rows);
        }
            /*
        console.log('Final filtered results being sent to frontend:', results);
        */
        res.json(results);
    } catch (error) {
        console.error('Error filtering recipes:', error);
        res.status(500).json({ error: 'Failed to filter recipes.' });
    }
});

// Route to fetch the count of recipes
router.get('/count', async (req, res) => {
    console.log("Received request to /api/recipes/count");
    try {
        const [result] = await db.query('SELECT COUNT(*) AS count FROM recipes');

        console.log('Recipe count result:', result); // Log the result

        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json({ count: result[0].count });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

router.get('/:recipeId', async (req, res) => {
    const { recipeId } = req.params;

    try {
        const query = `
            SELECT id, name, ingredients, nutrition, photo, minutes AS cookingTime,
                   CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(nutrition, ',', 1), '[', -1) AS DECIMAL(10,2)) AS calories,
                   steps
            FROM recipes
            WHERE id = ?;
        `;

        const [rows] = await db.query(query, [recipeId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        res.status(500).json({ error: 'Failed to fetch recipe details' });
    }
});


// 📌 API להוספת מתכון חדש (ללא העלאת תמונה)
router.post('/add', async (req, res) => {
    try {
        const {
            name,
            minutes,
            tags,
            nutrition,
            steps,
            ingredients,
            uploader
        } = req.body;

        // הגדרת ערכי ברירת מחדל
        const defaultName = "Default Recipe Name";
        const defaultIngredient = JSON.stringify(["Apple"]);
        const defaultSteps = JSON.stringify(["Wash the apple"]);
        const defaultCategory = "Breakfast";
        const defaultTime = 40;
        const defaultNutrition = JSON.stringify({
            calories: 50,
            fat: "50 g",
            sugar: "50 g",
            sodium: "50 mg",
            protein: "50 g",
            saturatedFat: "50 g",
            carbohydrates: "50 g"
        });

        // השמת ערכים אם חסרים
        const recipeName = name || defaultName;
        const recipeTime = minutes || defaultTime;
        const recipeTags = tags || defaultCategory;
        const recipeSteps = steps || defaultSteps;
        const recipeIngredients = ingredients || defaultIngredient;
        const recipeNutrition = nutrition || defaultNutrition;

        // הוספת מתכון לטבלה
        const [recipeResult] = await db.query(
            `INSERT INTO recipes (name, minutes, tags, nutrition, steps, ingredients, uploader) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [recipeName, recipeTime, recipeTags, recipeNutrition, recipeSteps, recipeIngredients, uploader || "Anonymous"]
        );

        res.json({ success: true, message: "Recipe added successfully", recipeId: recipeResult.insertId });
    } catch (error) {
        console.error("❌ Error adding recipe:", error);
        res.status(500).json({ error: 'Database error' });
    }
});


export default router;
