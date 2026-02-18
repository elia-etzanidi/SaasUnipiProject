const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', required: true 
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
    },
    text: { 
        type: String, 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    receiverGroup: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'group' 
    },
});

module.exports = mongoose.model('message', MessageSchema);