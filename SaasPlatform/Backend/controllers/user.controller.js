const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// LOGIN
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

// GET CURRENT USER
exports.getMe = async (req, res) => {
    try {
        const User = require('../models/User'); // Better at the top of the file, but keep it here for now if you prefer
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
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