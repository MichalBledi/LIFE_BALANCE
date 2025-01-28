import express from 'express';
import db from '../database/db.js';

const router = express.Router();

// 📌 הצגת כל המשתמשים (בדיקות בלבד)
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users." });
    }
});

// 📌 בדיקת זמינות שם משתמש
router.get('/users/check-username/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const [result] = await db.query('SELECT COUNT(*) AS count FROM users WHERE username = ?', [username]);
        res.json({ isAvailable: result[0].count === 0 });
    } catch (error) {
        console.error("❌ Error checking username:", error);
        res.status(500).json({ error: "Failed to check username availability." });
    }
});

// 📌 הרשמת משתמש חדש
router.post('/register', async (req, res) => {
    const { username, email, password, birthDate, gender, goal, height, weight, activity, allergies } = req.body;

    try {
        // המרת מטרות (ENUM)
        const purposeMap = {
            "Lose weight": "weight_loss",
            "Gain weight": "weight_gain",
            "Maintain weight": "maintenance"
        };
        const formattedPurpose = purposeMap[goal] || "maintenance";

        // המרת פעילות (מספרי)
        const activityMap = {
            "Never": 1.2,
            "Rarely": 1.375,
            "Sometimes": 1.55,
            "Often": 1.725,
            "Always": 1.9
        };
        const formattedActivity = activityMap[activity] || 1.2;

        const query = `
            INSERT INTO users (username, email, password, date_of_birth, gender, purpose, height, weight, activity_index, allergies)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [username, email, password, birthDate, gender, formattedPurpose, height, weight, formattedActivity, allergies];
        await db.query(query, params);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: 'Failed to register user. Please try again.' });
    }
});

// 📌 התחברות משתמש (תיקון `loginUser is not defined`)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("🔍 Login request received:", username, password);

        // חיפוש המשתמש במסד הנתונים
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length === 0) {
            console.warn("⚠ Invalid login attempt:", username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        console.log("✅ Login successful:", rows[0]);
        res.json({ message: 'Login successful', user: rows[0] });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/users/:username', async (req, res) => {
    const { username } = req.params;
    console.log("🔍 Fetching user details for:", username); // Debugging
    
    try {
        const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (user.length === 0) {
            console.warn("⚠ User not found:", username);
            return res.status(404).json({ message: "User not found" });
        }
        
        console.log("✅ User found:", user[0]);
        res.json(user[0]);
    } catch (error) {
        console.error("❌ Error fetching user details:", error);
        res.status(500).json({ error: "Failed to fetch user details." });
    }
});



export default router;
