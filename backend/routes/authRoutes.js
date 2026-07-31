const express = require('express');
const router = express.Router();

const { signup, login, logout } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}` });
});
router.post('/logout', protect,logout);
module.exports = router;


