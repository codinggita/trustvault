const express = require('express');

const { login, logout, me, register } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { loginValidator, registerValidator } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.post('/logout', authLimiter, logout);
router.get('/me', protect, me);

module.exports = router;
