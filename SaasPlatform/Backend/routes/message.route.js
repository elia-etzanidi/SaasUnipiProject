const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth');

router.post('/', auth, messageController.sendMessage);
router.get('/:userId', auth, messageController.getChat);
router.get('/group/:groupId', auth, messageController.getGroupChat);

module.exports = router;