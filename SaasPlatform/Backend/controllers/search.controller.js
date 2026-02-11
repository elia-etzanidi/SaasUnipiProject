const Post = require('../models/Post');
const User = require('../models/User');

exports.searchAll = async (req, res) => {
    const query = req.query.q;
    try {
        // user search by name, username, or tags
        const users = await User.find({
            $or: [
                { fullName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { interests: { $regex: query, $options: 'i' } },
                { courses: { $regex: query, $options: 'i' } }
            ]
        }).select('-password');

        // search posts by tags and text content
        const posts = await Post.find({
            $or: [
                { tags: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        }).populate('user', 'fullName email interests');

        res.json({ users, posts });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};