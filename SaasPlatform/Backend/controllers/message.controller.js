const Message = require('../models/Message');

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
    try {
        const { receiver, text } = req.body;
        const newMessage = new Message({
            sender: req.user.id,
            receiver,
            text
        });
        await newMessage.save();
        res.json(newMessage);
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