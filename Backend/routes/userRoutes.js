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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      location,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.patch('/:userId/location', async (req, res) => {
  const { userId } = req.params;
  const { latitude, longitude } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    await user.save();
    console.log('Location updated in database');
    res.status(200).json({ success: true, message: 'Location updated' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/nearby', async (req, res) => {
  const { latitude, longitude, radius } = req.query;

  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ success: false, message: 'Missing required query parameters' });
  }

  try {
    const users = await User.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / 6378.1] // radius in radians
        }
      }
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching nearby users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;