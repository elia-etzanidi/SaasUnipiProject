const Group = require('../models/Group');

// GET USER GROUPS
exports.getUserGroups = async (req, res) => {
    try {
        // Groups where the user is a member
        const groups = await Group.find({ members: req.user.id })
            .sort({ createdAt: -1 });
        
        res.json(groups);
    } catch (err) {
        console.error("Get Groups Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// CREATE GROUP
exports.createGroup = async (req, res) => {
    try {
        const { name, members } = req.body; // members: array από user IDs

        if (!name || !members || members.length === 0) {
            return res.status(400).json({ msg: 'Please provide a name and members.' });
        }

        // Add the creator to the members list if not already included
        const allMembers = [...new Set([...members, req.user.id])];

        const newGroup = new Group({
            name,
            admin: req.user.id,
            members: allMembers
        });

        const group = await newGroup.save();
        res.status(201).json(group);
    } catch (err) {
        console.error("Create Group Error:", err.message);
        res.status(500).send('Server Error');
    }
};