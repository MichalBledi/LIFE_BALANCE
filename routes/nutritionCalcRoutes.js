import express from "express";
import pool from "../database/db.js"; // ✅ ודאי שהייבוא קיים

const router = express.Router();

// 📌 חיפוש מוצרי מזון לפי שם
router.get("/search", async (req, res) => {
    const searchTerm = req.query.q || ''; // מקבל את מונח החיפוש מהשאילתה
    console.log("🔍 Searching for food:", searchTerm);

    try {
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
                calcium, 
                iron, 
                potassium, 
                vitamin_c, 
                vitamin_d, 
                nutrition_density
             FROM food
            WHERE LOWER(food_name) LIKE LOWER(?)
            LIMIT 3;
        `;

        const searchPattern = `%${searchTerm}%`; // חיפוש חופשי בתוך השם
        const [foods] = await pool.query(query, [searchPattern]);

        res.json(foods);
    } catch (err) {
        console.error("❌ Error searching for food:", err);
        res.status(500).json({ error: "Failed to search food items." });
    }
});

export default router;
