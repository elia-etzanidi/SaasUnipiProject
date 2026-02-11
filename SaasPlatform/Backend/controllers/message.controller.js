const Message = require('../models/Message');
const Group = require('../models/Group');
const User = require('../models/User');
const { getIO, getOnlineUsers } = require('../socket');

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

        // --- SOCKET LOGIC ---
        const io = getIO();
        const onlineUsers = getOnlineUsers();
        const senderName = populatedMessage.sender.fullName;

        if (groupId) {
            const group = await Group.findById(groupId);
            // Case Group Message
            if (group) {
                group.members.forEach(memberId => {
                    if (String(memberId) !== String(req.user.id)) {
                        const onlineMember = onlineUsers.find(u => String(u.userId) === String(memberId));
                        if (onlineMember) {
                            io.to(onlineMember.socketId).emit('getMessage', populatedMessage);
                            io.to(onlineMember.socketId).emit('notification', {
                                title: `New message in ${group.name}`,
                                text: `${senderName}: ${text}`,
                                groupId: String(groupId),
                            });
                        }
                    }
                });
            }
        } else {
            // Case Direct Message
            const onlineReceiver = onlineUsers.find(u => String(u.userId) === String(receiver));
            if (onlineReceiver) {
                io.to(onlineReceiver.socketId).emit('getMessage', populatedMessage);
                io.to(onlineReceiver.socketId).emit('notification', {
                    title: `New message from ${senderName}`,
                    text: text, 
                    senderId: String(req.user.id)
                });
            }
        }
        // ----------------------

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
            // Pass the User model directly to populate
            .populate({
                path: 'sender',
                model: User,
                select: 'fullName'
            })
            .sort({ createdAt: 1 });
        
        res.json(messages);
    } catch (err) {
        console.error("Error in getGroupChat:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};