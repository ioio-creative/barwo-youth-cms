const jwt = require('jsonwebtoken');
const config = require('config');

const { NOT_AUTHORIZED } = require('../types/responses/auth');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    // 401: unauthorized
    return res.status(401).json({ type: NOT_AUTHORIZED });
  }

  try {
    const decoded = jwt.verify(token, config.get('Jwt_Secret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    // 401 unauthorized
    res.status(401).json({ type: NOT_AUTHORIZED });
  }
};
