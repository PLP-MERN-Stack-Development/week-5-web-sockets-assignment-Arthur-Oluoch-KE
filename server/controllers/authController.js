const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const users = []; // In-memory user store (replace with DB in production)

exports.login = async (req, res) => {
  const { username, password } = req.body;
  let user = users.find(u => u.username === username);
  
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = { username, password: hashedPassword, id: Date.now().toString() };
    users.push(user);
  } else if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, { expiresIn: '5h' });
  res.json({ token, userId: user.id, username });
};