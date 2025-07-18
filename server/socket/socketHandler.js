const jwt = require('jsonwebtoken');

module.exports = (io, socket) => {
  let currentUser = null;

  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      currentUser = decoded;
      socket.join('global');
      io.emit('userStatus', { userId: currentUser.id, username: currentUser.username, online: true });
    } catch (err) {
      socket.disconnect();
    }
  });

  socket.on('message', ({ room, message }) => {
    const msg = { id: Date.now(), sender: currentUser, text: message, timestamp: new Date(), read: false };
    io.to(room).emit('message', msg);
  });

  socket.on('privateMessage', ({ recipientId, message }) => {
    const msg = { id: Date.now(), sender: currentUser, text: message, timestamp: new Date(), read: false };
    socket.to(recipientId).emit('privateMessage', msg);
    socket.emit('privateMessage', msg);
  });

  socket.on('typing', ({ room, isTyping }) => {
    socket.to(room).emit('typing', { user: currentUser, isTyping });
  });

  socket.on('readReceipt', ({ messageId, room }) => {
    io.to(room).emit('readReceipt', { messageId, userId: currentUser.id });
  });

  socket.on('reaction', ({ messageId, reaction, room }) => {
    io.to(room).emit('reaction', { messageId, userId: currentUser.id, reaction });
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    io.to(room).emit('notification', { message: `${currentUser.username} joined ${room}` });
  });

  socket.on('disconnect', () => {
    if (currentUser) {
      io.emit('userStatus', { userId: currentUser.id, username: currentUser.username, online: false });
    }
  });
};