import express from 'express';
import db from '../database/db.js';

const router = express.Router();

router.get('/users', (req, res) => {
    getUsers((err, users) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(users);
        }
    });
});

router.get('/users/check-username/:username', (req, res) => {
    const { username } = req.params;
    checkUsernameAvailability(username, (err, isAvailable) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ isAvailable });
        }
    });
});

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password, birthDate, gender, goal, height, weight, activity, allergies } = req.body;

    try {
        // Define allowed ENUM values for `purpose`
        const purposeMap = {
            "Lose weight": "weight_loss",
            "Gain weight": "weight_gain",
            "Maintain weight": "maintenance"
        };

        // Convert user input into ENUM format
        const formattedPurpose = purposeMap[goal] || "maintenance"; // Ensure default if goal is missing

        // Map activity levels to numeric values
        const activityMap = {
            "Never": 1.2,      // Sedentary
            "Rarely": 1.375,   // Light activity
            "Sometimes": 1.55, // Moderate activity
            "Often": 1.725,    // Very active
            "Always": 1.9      // Super active
        };

        // Ensure activity is converted to a numeric value
        const formattedActivity = activityMap[activity] || 1.2;  // Default to sedentary (1.2) if not found

        const query = `
            INSERT INTO users (username, email, password, date_of_birth, gender, purpose, height, weight, activity_index, allergies)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            username, 
            email, 
            password, 
            birthDate, 
            gender, 
            formattedPurpose,  // Already mapped ENUM value
            height, 
            weight, 
            formattedActivity,  // Now a valid decimal value
            allergies
        ];

        const [result] = await db.query(query, params);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user. Please try again.' });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    loginUser(username, password, (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!user) {
            res.status(401).json({ message: 'Invalid username or password' });
        } else {
            res.json({ message: 'Login successful', user });
        }
    });
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

export default router;
