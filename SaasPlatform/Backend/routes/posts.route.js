const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postController = require('../controllers/post.controller');

// @route   POST api/posts
// @desc    Create a post
router.post('/', auth, postController.createPost);

// @route   GET api/posts
// @desc    Get all posts
router.get('/', auth, postController.getPosts);

module.exports = router;