
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../socket/socket';
import Message from '../components/Message';
import UserList from '../components/UserList';
import RoomSelector from '../components/RoomSelector';

function Chat() {
  const { messages, users, typingUsers, sendMessage, sendPrivateMessage, setTyping, joinRoom } = useSocket();
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('global');
  const [recipientId, setRecipientId] = useState('');
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    joinRoom(room);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [room, messages, joinRoom]);

  const handleSendMessage = () => {
    if (message.trim()) {
      if (recipientId) {
        sendPrivateMessage(recipientId, message);
      } else {
        sendMessage(room, message);
      }
      setMessage('');
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setTyping(room, e.target.value.length > 0);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <UserList setRecipientId={setRecipientId} />
        <RoomSelector setRoom={setRoom} />
      </div>
      <div className="w-3/4 p-4">
        <div className="h-5/6 overflow-y-auto mb-4">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} user={user} />
          ))}
          {typingUsers.map((u) => (
            <div key={u.id} className="text-gray-500 text-sm">
              {u.username} is typing...
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow p-2 border"
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
