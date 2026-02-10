const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// SIGN UP
router.post('/register', userController.registerUser);
// LOGIN
router.post('/login', userController.loginUser);
// GET CURRENT USER
router.get('/me', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;