const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
  
exports.findUsersWithinBoundary = async (req, res) => {
  const { boundary } = req.body; // Expecting boundary as GeoJSON Polygon

  if (!boundary || !boundary.type || boundary.type !== 'Polygon') {
    return res.status(400).json({ success: false, message: 'Invalid boundary data' });
  }

  try {
    const users = await User.find({
      location: {
        $geoWithin: {
          $geometry: boundary
        }
      }
    });

    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users within boundary:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

