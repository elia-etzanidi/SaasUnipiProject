const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// SIGN UP
router.post('/register', userController.registerUser);
// MANUAL LOGIN
router.post('/login', userController.loginUser);
// GOOGLE LOGIN
router.post('/google', userController.googleLogin);
// COMPLETE PROFILE
router.put('/profile', auth, userController.updateProfile);
// GET CURRENT USER
router.get('/me', auth, userController.getMe);
// FOLLOW USER
router.put('/follow/:id', auth, userController.followUser);

module.exports = router;