import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Connect to socket server with JWT token
  const connect = (token) => {
    socket.auth = { token };
    socket.connect();
  };

  // Disconnect from socket server
  const disconnect = () => {
    socket.disconnect();
  };

  // Send a message to a room
  const sendMessage = (room, message) => {
    socket.emit('message', { room, message });
  };

  // Send a private message
  const sendPrivateMessage = (recipientId, message) => {
    socket.emit('privateMessage', { recipientId, message });
  };

  // Set typing status
  const setTyping = (room, isTyping) => {
    socket.emit('typing', { room, isTyping });
  };

  // Join a room
  const joinRoom = (room) => {
    socket.emit('joinRoom', room);
  };

  // Socket event listeners
  useEffect(() => {
    // Connection events
    const onConnect = () => {
      setIsConnected(true);
      console.log('Socket connected');
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Message events
    const onReceiveMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
      if (Notification.permission === 'granted') {
        new Notification(`${message.sender.username}: ${message.text}`);
      }
    };

    const onPrivateMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
      if (Notification.permission === 'granted') {
        new Notification(`${message.sender.username}: ${message.text}`);
      }
    };

    // User events
    const onUserStatus = (userStatus) => {
      setUsers((prev) => {
        const updated = prev.filter((u) => u.userId !== userStatus.userId);
        if (userStatus.online) updated.push(userStatus);
        return updated;
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${userStatus.username} ${userStatus.online ? 'joined' : 'left'} the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    // Typing events
    const onTyping = ({ user, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          return [...prev.filter((u) => u.id !== user.id), user];
        }
        return prev.filter((u) => u.id !== user.id);
      });
    };

    // Notification events
    const onNotification = ({ message }) => {
      if (Notification.permission === 'granted') {
        new Notification(message);
      }
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onReceiveMessage);
    socket.on('privateMessage', onPrivateMessage);
    socket.on('userStatus', onUserStatus);
    socket.on('typing', onTyping);
    socket.on('notification', onNotification);

    // Clean up event listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onReceiveMessage);
      socket.off('privateMessage', onPrivateMessage);
      socket.off('userStatus', onUserStatus);
      socket.off('typing', onTyping);
      socket.off('notification', onNotification);
    };
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    joinRoom,
  };
};

export default socket;