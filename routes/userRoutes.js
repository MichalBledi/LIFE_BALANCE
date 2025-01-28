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

export default router;
