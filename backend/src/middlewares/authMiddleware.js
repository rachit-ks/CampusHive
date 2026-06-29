const jwt = require('jsonwebtoken');
const protect = (req,res,next) => {
  try {
    const authHeader = req.header.authorization;
    if (!authHeader || !authHeader.startWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, access denied'});
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token'});
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied for your role' });
    }
    next();
  };
};

module.exports = { protect, authorize };