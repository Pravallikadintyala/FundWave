const express = require('express');
const router = express.Router();

const { signup, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
const protect = require('../middleware/authMiddleware');
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}` });
});

module.exports = router;


