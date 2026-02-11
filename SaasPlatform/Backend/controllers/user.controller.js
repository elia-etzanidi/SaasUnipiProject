const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SIGN UP
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, interests, courses } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "The user already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ fullName, email, password: hashedPassword, interests, courses });
    await user.save();
    res.status(201).json({ msg: "The user was created successfully!" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// MANUAL LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Wrong email or password" });

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong email or password" });

    // 3. Create JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Τoken expires in 1 day
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { email, name, sub } = ticket.getPayload();

        let user = await User.findOne({ email });
        let isNewUser = false;

        if (!user) {
            user = new User({
                fullName: name || email.split('@')[0],
                email,
                password: 'google-auth-' + sub, // Dummy password
                interests: [],
                courses: []
            });
            await user.save();
            isNewUser = true;
        } else if (user.interests.length === 0 && user.courses.length === 0) {
            isNewUser = true;
        }

        const jwtToken = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
        );

        res.json({
            token: jwtToken, // Εδώ στέλνουμε το δικό μας πλέον token στο frontend
            isNewUser, 
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (err) {
        res.status(401).json({ msg: 'Google verification failed' });
    }
};

// COMPLETE PROFILE (for Google users)
exports.updateProfile = async (req, res) => {
    try {
        const { interests, courses } = req.body;
        
        // Το req.user.id έρχεται από το auth middleware
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { interests, courses } },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// GET CURRENT USER
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('contacts', 'fullName');
        
        // check if user exists
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        return res.json(user);

    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};

// FOLLOW USER (ADD TO CONTACTS)
exports.followUser = async (req, res) => {
    try {
        const userToFollowId = req.params.id;
        const currentUserId = req.user.id;

        if (userToFollowId === currentUserId) {
            return res.status(400).json({ msg: "You cannot add yourself to contacts" });
        }

        // addToSet ensures no duplicates
        await User.findByIdAndUpdate(currentUserId, {
            $addToSet: { contacts: userToFollowId }
        });

        res.json({ msg: "Added to contacts successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};