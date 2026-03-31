const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect: Bearer <token>
  if (!token) return res.status(401).json({ error: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: ... }
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token.' });
  }
};

module.exports = verifyToken;

