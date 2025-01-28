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


// Get the number of users
router.get('/count', async (req, res) => {
    console.log("Received request to /api/users/count");
    try {
        const [rows] = await db.execute('SELECT COUNT(*) AS count FROM users');
        console.log("Query executed successfully", rows);
        const count = rows[0].count;
        res.json({ count });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ error: 'Failed to fetch user count' });
    }
});

router.get('/success-rate', async (req, res) => {
    try {
        console.log("Calculating success rate...");

        const query = `
            WITH first_last_bmi AS (
    SELECT 
        user_id,
        MIN(date) AS first_date,
        MAX(date) AS last_date
    FROM bmi_history
    GROUP BY user_id
),
user_bmi AS (
    SELECT 
        f.user_id,
        u.purpose,  -- User's goal (weight_loss, weight_gain, maintenance)
        (SELECT bmi FROM bmi_history WHERE user_id = f.user_id AND date = f.first_date LIMIT 1) AS first_bmi,
        (SELECT bmi FROM bmi_history WHERE user_id = f.user_id AND date = f.last_date LIMIT 1) AS last_bmi
    FROM first_last_bmi f
    JOIN users u ON u.id = f.user_id
)
SELECT 
    COUNT(*) AS total_users,
    SUM(
        CASE
            WHEN purpose = 'weight_loss' AND first_bmi > last_bmi THEN 1
            WHEN purpose = 'weight_gain' AND first_bmi < last_bmi THEN 1
            WHEN purpose = 'maintenance' AND ABS(first_bmi - last_bmi) <= 2 THEN 1
            ELSE 0
        END
    ) AS successful_users
FROM user_bmi;

        `;

        const [result] = await db.query(query);
        const { total_users, successful_users } = result[0];

        // Calculate success rate
        const successRate = total_users > 0 ? ((successful_users / total_users) * 100).toFixed(2) : 0;

        console.log(`Success Rate: ${successRate}% (${successful_users}/${total_users})`);
        res.json({ successRate });
    } catch (error) {
        console.error("Error calculating success rate:", error);
        res.status(500).json({ error: "Database query failed" });
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
