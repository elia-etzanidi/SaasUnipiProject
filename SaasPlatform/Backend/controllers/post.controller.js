const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a new post
exports.createPost = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            content: req.body.content,
            tags: req.body.tags,
            author: user.fullName,
            handle: `@${user.fullName.toLowerCase().replace(/\s/g, '')}`,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all posts
exports.getPosts = async (req, res) => {
    try {
        // Sort by date descending (newest first)
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};