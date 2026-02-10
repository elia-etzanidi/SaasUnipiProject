const User = require('../models/User');
const bcrypt = require('bcrypt');

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