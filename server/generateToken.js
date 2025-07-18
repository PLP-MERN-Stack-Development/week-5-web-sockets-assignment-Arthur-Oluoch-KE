const { generateToken } = require('./utils/jwt');

// Sample user payload
const payload = {
  id: '1234567890',
  username: 'testuser',
};

// Generate JWT token
const token = generateToken(payload);
console.log('Generated JWT Token:', token);