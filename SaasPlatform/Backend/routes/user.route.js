const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// SIGN UP
router.post('/register', userController.registerUser);
// LOGIN
router.post('/login', userController.loginUser);
// GET CURRENT USER
router.get('/me', auth, userController.getMe);

module.exports = router;