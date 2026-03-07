const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token, access denied' });

    // This will throw an error if token is expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: false });

    req.user = decoded;
    next();
  } catch (error) {
    // Specifically handle expired tokens
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { protect };