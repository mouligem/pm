const express = require('express');
const Password = require('../models/Password'); // Password model
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get stored passwords
router.get('/passwords', authenticateToken, async (req, res) => {
    try {
        const passwords = await Password.find({ userId: req.user.userId });
        res.status(200).json(passwords);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching passwords' });
    }
});

// Store password
router.post('/passwords', authenticateToken, async (req, res) => {
    const { website, password } = req.body;

    try {
        const newPassword = new Password({
            userId: req.user.userId,
            website,
            password,
        });
        await newPassword.save();
        res.status(201).json({ message: 'Password stored successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error storing password' });
    }
});

module.exports = router;
