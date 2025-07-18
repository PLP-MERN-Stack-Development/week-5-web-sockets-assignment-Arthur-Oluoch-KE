const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

module.exports = {
  generateToken: (payload) => jwt.sign(payload, jwtSecret, { expiresIn: '1h' }),
  verifyToken: (token) => jwt.verify(token, jwtSecret),
};