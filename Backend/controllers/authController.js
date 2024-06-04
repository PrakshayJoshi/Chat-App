const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    user = new User({
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      '7A3B234D3A172E83BBD9ABCC7AE1F',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ success: true, token, user: payload.user });
      }
    );
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, '7A3B234D3A172E83BBD9ABCC7AE1F', { expiresIn: '1h' });

    res.json({ success: true, token, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// authController.js

exports.validateToken = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, '7A3B234D3A172E83BBD9ABCC7AE1F');
    const user = await User.findById(decoded.user.id);
    res.json({ success: true, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};


exports.register = async (req, res) => {
  try {
    const { username, email, password, location } = req.body;
    const user = new User({ username, email, password, location });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
  