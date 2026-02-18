const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../../middleware/auth');

// POST /signup
router.post('/signup', authController.signup);

// POST /auth/login
router.post('/auth/login', authController.login);

// GET /auth/logout
router.get('/auth/logout', authMiddleware, authController.logout);

// POST /auth/refresh
router.post('/auth/refresh', authController.refreshToken);

module.exports = router;
