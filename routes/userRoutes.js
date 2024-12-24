import express from 'express';
import { getUsers, addUser, checkUsernameAvailability, loginUser } from '../logic/userLogic.js';

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

router.post('/register', (req, res) => {
    const { username, firstName, lastName, password, birthDate } = req.body;
    addUser(username, firstName, lastName, password, birthDate, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'User registered successfully' });
        }
    });
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
