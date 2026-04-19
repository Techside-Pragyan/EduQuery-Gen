const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    res.json({ message: 'Login feature coming soon', user: { id: 1, name: 'Guest User' }, token: 'dummy-token' });
});

router.post('/register', (req, res) => {
    res.json({ message: 'Registration feature coming soon' });
});

module.exports = router;
