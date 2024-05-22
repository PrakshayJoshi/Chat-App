const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, email, password, location } = req.body;
  try {
    if (!username || !email || !password || !location || !location.coordinates) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,  // Save the hashed password
      location,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
