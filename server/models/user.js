const users = []; // In-memory user store (replace with DB in production)

module.exports = {
  findByUsername: (username) => users.find((u) => u.username === username),
  findById: (id) => users.find((u) => u.id === id),
  create: (user) => users.push(user),
};