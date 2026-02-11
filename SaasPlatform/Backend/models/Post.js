const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    author: {
        type: String,
        required: true
    },
    handle: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    tags: [String],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('post', PostSchema);