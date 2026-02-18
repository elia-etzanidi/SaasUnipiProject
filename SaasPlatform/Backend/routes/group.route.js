const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const auth = require('../middleware/auth');

// GET USER GROUPS
router.get('/', auth, groupController.getUserGroups);
// CREATE GROUP
router.post('/', auth, groupController.createGroup);

module.exports = router;