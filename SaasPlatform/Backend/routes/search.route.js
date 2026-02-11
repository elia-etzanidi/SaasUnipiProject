const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const searchController = require('../controllers/search.controller');

// @route   GET api/search
// @desc    Αναζήτηση για posts και χρήστες
// @access  Private (ή Public αν προτιμάς)
router.get('/', auth, searchController.searchAll);

module.exports = router;