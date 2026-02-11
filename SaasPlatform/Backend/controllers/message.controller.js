const Message = require('../models/Message');
const Group = require('../models/Group');
const User = require('../models/User');

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
    try {
        // receiver: userId για direct message, groupId για group message
        const { receiver, groupId, text } = req.body;
        const newMessage = new Message({
            sender: req.user.id,
            text,
            // If groupId is provided, it's a group message; 
            // otherwise, it's a direct message
            receiverGroup: groupId || null,
            receiver: groupId ? null : receiver
        });

        const savedMessage = await newMessage.save();
        const populatedMessage = await Message.findById(savedMessage._id).populate('sender', 'fullName');
        res.json(populatedMessage);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// GET CHAT MESSAGES
exports.getChat = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 }); // Sort by creation time
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// GET GROUP CHAT MESSAGES
exports.getGroupChat = async (req, res) => {
    try {
        const { groupId } = req.params;

        const messages = await Message.find({ receiverGroup: groupId })
            // Αντί για 'sender', δοκίμασε να περάσεις το αντικείμενο 
            // για να μην ψάχνει το registered name
            .populate({
                path: 'sender',
                model: User, // Εδώ δίνουμε απευθείας το μοντέλο
                select: 'fullName'
            })
            .sort({ createdAt: 1 });
        
        res.json(messages);
    } catch (err) {
        console.error("Error in getGroupChat:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};