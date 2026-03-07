// This runs after protect middleware (which gives us req.user)
// It checks if the logged in user has the required role

const allowRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Not authorized.' });
    }
    next(); // Role is allowed, continue
  };
};

module.exports = { allowRoles };