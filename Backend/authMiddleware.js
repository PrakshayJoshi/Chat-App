const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Access token not provided' });
  jwt.verify(token, '7A3B234D3A172E83BBD9ABCC7AE1F', (error, decoded) => {
    if (error) return res.status(403).json({ success: false, error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};
